import L, { Map } from "leaflet";
import { useMap } from "react-leaflet";

import HotPolyline from "./core/HotPolyline";

import { defaultOptions } from "./constants";
import { HotlineEventHandlers, HotlineGetter, HotlineOptions } from "./types";

const getWeight = ( { weight, tolerance }: HotlineOptions ) => 
    (weight ? weight : defaultOptions.weight) + 
    (tolerance ? tolerance : defaultOptions.tolerance)


function eventPolylines<T, U>(
    map: Map,
    data: T[] | T[][], getLat: HotlineGetter<T>, getLng: HotlineGetter<T>, 
    options: HotlineOptions, 
    eventHandlers?: HotlineEventHandlers 
)
{
    if ( eventHandlers === undefined ) return [];

    const createPolyline = (_data: T[], i: number) => {
        const polyline = L.polyline( 
            _data.map( (d: T, i: number) => ( { lat: getLat(d, i), lng: getLng(d, i) } ) ), 
            {
                color: 'red',
                weight: getWeight(options),
                opacity: 0,
            }
        )

        Object.entries(eventHandlers).forEach( ([k, v]) => {
            polyline.on( k, e => v(e, i, polyline) )
        } )

        return polyline.addTo( map )
    }
    
    const polylines = Array.isArray(data[0])
        ? (data as T[][]).map( (d: T[], i: number) => createPolyline(d, i) )
        : [createPolyline(data as T[], 0)]

    return polylines;
}

export default eventPolylines; 