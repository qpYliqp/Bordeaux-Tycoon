import {createClient} from 'redis';

const GEO_EXP_KEY = "stops-exp";
const GEO_STOP_KEY = "stops";
const GEO_WHITELIST_KEY = "stops-whitelist";
const GEO_EXP_TIME = 60 * 60 * 24 * 2; // 2 Days

const client = createClient({
    url: "redis://redis:6379"
});

await client.connect();

client.on('error', err => console.log('Redis Client Error', err));

export const storeString = async (key, value, expiry) => {
    await client.set(key, value);
    await client.expire(key, expiry);
}

export const retrieveString = async (key) => {
    if(await client.exists(key)) {
        return await client.get(key);
    }
    return undefined;
}

export const clearActiveZSETCache = async () => {
    const time = Date.now();
    if(await client.exists(GEO_STOP_KEY) && await client.exists(GEO_EXP_KEY)) {
        const expired = await client.zRangeByScore(GEO_EXP_KEY, "-inf", Math.floor(time / 1000));
        await Promise.all(expired.map(async (v) => {
            await client.zRem(GEO_EXP_KEY, v);
            await client.zRem(GEO_STOP_KEY, v);
        }));
        console.log("Geo cache cleared : " + expired.length + " keys were removed");
    } else {
        console.log("Geo cache is empty");
    }
}

export const tryCacheStops = async (center, radius) => {
    const minStopsForCalculation = isInHighDensity(center) ? 5 : 3;

    if(await client.exists(GEO_STOP_KEY)) {
        let results = await searchStops(center,radius);

        if(results >= minStopsForCalculation) {
            console.log("CACHE HIT (Geo) : ", results);
            return results;
        }

        const whitelistCompleteKey = `${GEO_WHITELIST_KEY} [${center[0]},${center[1]}]`
        if(await client.exists(whitelistCompleteKey)) {
            console.log("CACHE SKIP (Geo)");
           return Number(await retrieveString(whitelistCompleteKey));
        }

        console.log("CACHE MISS (Geo) : ",results, " out of the required : ", minStopsForCalculation);
        const stops = await addAndSearchStops(center,radius)

        // Prevent further cache miss for this key if stop requirement fail again (Might be away from any stops)
        if(stops < minStopsForCalculation) {
            await storeString(whitelistCompleteKey, stops, GEO_EXP_TIME)
        }
        return stops;
    } else {
        console.log("CACHE MISS (Geo) : first try");
        return await addAndSearchStops(center, radius);
    }
}

const addAndSearchStops = async (center, radius) => {
    const radiusMultiplier = isInHighDensity(center) ? 4 : 6;
    await cacheStops(center, radius * radiusMultiplier); // Bigger radius to absorb more cache request

    return searchStops(center,radius);
}

const searchStops = async (center, radius) => {
    return (await client.geoRadius(GEO_STOP_KEY, {
        longitude: center[0],
        latitude: center[1]
    }, radius, "m")).length;
}

const cacheStops = async (center, radius) => {
    const url = 'https://data.bordeaux-metropole.fr/geojson/features/sv_arret_p?key=CDDZZIIZDU&filter={"geom":{"$geoWithin":{"$center":['+center[0]+','+center[1]+'],"$radius":'+radius+'}}}';

    const response = await fetch(url);
    const json = await response.json();

    await Promise.all(json.features.map(async (stop) => {
        const coordinates = stop.geometry.coordinates;
        const id = stop.properties.gid;
        const active = stop.properties.actif;

        if(active) {
            const added = await client.geoAdd(GEO_STOP_KEY,{
                longitude: coordinates[0],
                latitude: coordinates[1],
                member: id.toString()
            },{NX : true}); // Only add new stops (NX Does not update on duplicates)

            if(added === 1) {
                await client.zAdd(GEO_EXP_KEY, { value: id.toString(), score: Math.floor(Date.now() / 1000) + GEO_EXP_TIME})
            }
        }
    }));
}

const isInHighDensity = (coords) => {
    const areas = [
        {lat : 44.840346 , lon : -0.582747, radius : 5}, // Meriadeck (Approximated bordeaux center)
        {lat : 44.7988401, lon : -0.6310364, radius : 2.3}, // Campus + Pessac offset
        {lat : 44.8277236, lon : -0.6755097, radius : 3.3} // Merignac airport + Merignac
    ];

    let res = false;
    areas.forEach((area) => res ||= isInArea(area,coords));
    return res;
}

const isInArea = (zone, testedPos) => {
    return Math.abs(getDistanceFromLatLonInKm(zone.lat, zone.lon, testedPos[1], testedPos[0])) <= zone.radius;
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const deg2rad = (deg) => {
    return deg * (Math.PI/180)
}