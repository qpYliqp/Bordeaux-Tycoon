import {useMap, useMapEvents} from "react-leaflet";

export function MapEventHandlers({handler}) {
    const map = useMap();

    useMapEvents({
        zoomend: () => {
            handler(map.getBounds());
        },
        moveend: () => {
            handler(map.getBounds());
        }
    })

    return (
        <></>
    );
}