import { Building, LastUpdate, generateBuildingPrice } from '../models/buildingModel.js';
import { getSharesByUserId } from './shareController.js';
import {retrieveString, storeString} from "../config/cache.js";

const convertToBuildingPreview = function (rawBuilding) {
    return {
        id: rawBuilding._id,
        name: rawBuilding.name,
        theme: rawBuilding.theme,
        importance: rawBuilding.importance,
        town: rawBuilding.town,
        latitude: rawBuilding.latitude,
        longitude: rawBuilding.longitude,
        remainingShares: rawBuilding.remainingShares
    };
}

const convertToBuilding = async function (rawBuilding) {
    return {
        id: rawBuilding._id,
        name: rawBuilding.name,
        theme: rawBuilding.theme,
        subtheme: rawBuilding.subtheme,
        status: rawBuilding.status,
        town: rawBuilding.town,
        importance: rawBuilding.importance,
        longitude: rawBuilding.longitude,
        latitude: rawBuilding.latitude,
        remainingShares: rawBuilding.remainingShares,
        price: rawBuilding.price
    };
}

export async function populateBuildings() {
    let url = "https://data.bordeaux-metropole.fr/geojson/features/to_eqpub_p?key=CDDZZIIZDU";

    const now = new Date().toISOString();

    let lastUpdate = await LastUpdate.findOneAndUpdate({}, { updateDate: now });
    let isCreating = false;

    if (!lastUpdate) {
        lastUpdate = new LastUpdate({ updateDate: now });
        lastUpdate.save();
        isCreating = true;
    } else {
        url += '&filter={ "mdate" :{ "$gt" : "' + lastUpdate.updateDate + '"}}';
    }

    const key = "populate";
    const cache = await retrieveString(key);
    if(cache === undefined) {
        await storeString(key,"",60 * 60 * 24);
    } else {
        return {
            success: true,
            message: "Building checked < 24h"
        }
    }

    const buildingPromise = await fetch(url);
    const rawBuildings = await buildingPromise.json();

    if (!rawBuildings || !rawBuildings.features) {
        return {
            success: true,
            message: "No buildings to populate"
        }
    }

    let rawCreatedBuildings = [];
    let rawModifiedBuildings = [];

    if (isCreating) {
        rawCreatedBuildings = rawBuildings.features;
    } else {
        rawCreatedBuildings = rawBuildings.features.filter((building) => {
            return dayDifference(building) <= 1;
        });

        rawModifiedBuildings = rawBuildings.features.filter((building) => {
            return dayDifference(building) > 1;
        });
    }

    const createdBuildings = rawCreatedBuildings.map((building) => {
        return new Building(createBuildingObject(building));
    });

    const createdDocs = await Building.collection.insertMany(createdBuildings);
    const modifiedDocs = await Promise.all(rawModifiedBuildings.map((building) => {
        return updateBuilding(building);
    }));

    return {
        success: true,
        message: "Buildings populated : " + createdDocs.insertedCount + " created, " + modifiedDocs.length + " modified"
    };
}

export async function getBuildings(filter, options) {
    const buildings = await Building.find(filter, null, options);
    return { success: true, data: buildings.map(convertToBuildingPreview) };
}

export async function getRawBuildingById(id) {
    try {
        const building = await Building.findById(id);
        if (!building) {
            return { success: false, message: "Building not found" };
        }
        if (building.price === 0) {
            building.price = await generateBuildingPrice(building.longitude, building.latitude, building.importance);
            building.save();
        }
        return { success: true, data: building };
    } catch (error) {
        return { error: true, message: error };
    }
}

export async function getBuildingById(id) {
    return await fetchAndConvertBuilding(id, convertToBuilding);
}

export async function getBuildingPreviewById(id) {
    return await fetchAndConvertBuilding(id, convertToBuildingPreview);
}

/**
 * Transforms a raw building fetched by the external API into a building object
 * 
 * @param {*} rawBuilding A raw building fetched by the external API
 * @returns An object representing the building and that can be used by the database
 */
const createBuildingObject = function (rawBuilding) {
    let buildingCoordinates = rawBuilding.geometry.coordinates;

    return {
        originalId: rawBuilding.properties.gid,
        name: rawBuilding.properties.nom,
        theme: rawBuilding.properties.theme,
        subtheme: rawBuilding.properties.sstheme,
        status: rawBuilding.properties.statut,
        importance: rawBuilding.properties.cat_dig,
        longitude: buildingCoordinates[0],
        latitude: buildingCoordinates[1],
        town: cityDictionnary[rawBuilding.properties.insee],
        price: 0
    };
}

/**
 * Fetch the building from the database and update it with the new data. Uses the original ID to find the building.
 * 
 * @param {*} rawBuilding The raw building fetched by the external API
 * @returns The building before update
 */
const updateBuilding = async function (rawBuilding) {
    const newBuilding = createBuildingObject(rawBuilding);
    return await Building.updateOne({ originalId: rawBuilding.properties.gid }, newBuilding);
}

const dayDifference = function (building) {
    const mDate = new Date(building.properties.mdate);
    const cDate = new Date(building.properties.cdate);

    const diff = Math.abs(mDate.getTime() - cDate.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
}

const fetchAndConvertBuilding = async function (id, conversion) {
    const res = await getRawBuildingById(id);
    if (!res.success) {
        return res;
    }

    return { success: true, data: await conversion(res.data) };
}

const cityDictionnary = {
    "33003": "Ambarès-et-Lagrave",
    "33004": "Ambès",
    "33013": "Artigues-Près-Bordeaux",
    "33032": "Bassens",
    "33039": "Bègles",
    "33056": "Blanquefort",
    "33063": "Bordeaux",
    "33065": "Bouliac",
    "33069": "Le Bouscat",
    "33075": "Bruges",
    "33096": "Carbon-Blanc",
    "33119": "Cenon",
    "33162": "Eysines",
    "33167": "Floirac",
    "33192": "Gradignan",
    "33200": "Le Haillan",
    "33249": "Lormont",
    "33273": "Martignas-sur-Jalle",
    "33281": "Mérignac",
    "33312": "Parempuyre",
    "33318": "Pessac",
    "33376": "Saint-Aubin-de-Médoc",
    "33434": "Saint-Louis-de-Montferrand",
    "33449": "Saint-Médard-en-Jalles",
    "33487": "Saint-Vincent-de-Paul",
    "33519": "Le Taillan Médoc",
    "33522": "Talence",
    "33550": "Villenave-d'Ornon",
    "33238": "Léognan",
    "33322": "Le Pian-Médoc",
    "33397": "Sainte-Eulalie",
    "33422": "Saint-Jean-d'Illac"
}