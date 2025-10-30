import { Schema, model } from "mongoose";
import {tryCacheStops} from "../config/cache.js";

const buildingSchema = new Schema({
    originalId: { type: String },
    name: { type: String },
    theme: { type: String },
    subtheme: { type: String },
    status: { type: String },
    importance: { type: Number },
    latitude: { type: Number },
    longitude: {type: Number},
    town: { type: String },
    price: {type: Number},
    shares: [
        { type: Schema.Types.ObjectId, ref: 'Share' }
    ],
    remainingShares: { type: Number, default: 10000 }
});

const lastUpdateSchema = new Schema({
    updateDate: { type: String }
});

export async function generateBuildingPrice(longitude,latitude,importance)
{
    let price = Math.floor(Math.random() * (10000 - 500 + 1)) + 500;
    if(importance !== 99 && importance != null)
    {
        price *= generatePriceForImportance(importance)
    }

    const nbStopAround = Math.max(0, Math.min(await tryCacheStops([longitude,latitude],500), 5));
    price = price * generatePriceForStop(nbStopAround);
    price = Math.floor(price);
    return price;
}

export function generateShareBuildingPrice(price,part)
{
    return  price * (part  / 10000);
}

function generatePriceForStop(x)
{
    return 0.5 * x + 1;
}

function generatePriceForImportance(x, x1 = 1, y1 = 5.04, m = -1.01253132532) {
    return m * (x - x1) + y1;
}

export const Building = model("Building", buildingSchema);

export const LastUpdate = model("LastUpdate", lastUpdateSchema);