import { generateShareBuildingPrice } from "../models/buildingModel.js";
import Share from "../models/shareModel.js";
import { getBuildingPreviewById, getRawBuildingById } from "./buildingController.js";
import { getRawUserById, getUserById } from "./userController.js";

const convertToStandardShare = async (rawShare) => {
    let res = await getUserById(rawShare.owner);
    const user = res.data;

    res = await getBuildingPreviewById(rawShare.building);
    const building = res.data;

    return {
        owner: user,
        building: building,
        amount: rawShare.amount
    }
};

export async function buyShares(buildingId, userId, amount) {
    let res = await getRawBuildingById(buildingId);
    if (!res.success) {
        return res;
    }

    const building = res.data;
    if (building.remainingShares < amount) {
        return { cannot: true, message: "Not enough shares available" };
    }

    res = await getRawUserById(userId);
    if (!res.success) {
        return res;
    }

    const user = res.data;
    const price = generateShareBuildingPrice(building.price, amount);

    if (user.money < price) {
        return { cannot: true, message: "Not enough money" };
    }

    return Share.findOne({ owner: user._id, building: building._id }).then(async (share) => {
        building.remainingShares -= amount;
        user.money -= price;

        user.hourlyIncome += price / 2;

        if (share) {
            share.amount += amount;
        }
        else {
            share = new Share({
                owner: user._id,
                building: building._id,
                amount: amount
            });
            building.shares.push(share);
            user.shares.push(share);
        }

        await share.save();
        await building.save();
        await user.save();
        return { success: true, data: await convertToStandardShare(share) };
    });
};

export async function sellShares(buildingId, userId, amount) {
    let share = await Share.findOne({ owner: userId, building: buildingId }).populate("building").populate("owner");
    if (!share) {
        return { success: false, message: "Shares not found" };
    }

    if (share.amount < amount) {
        return { error: true, message: "Not enough shares" };
    }


    share.amount -= amount;
    const building = share.building;
    building.remainingShares += amount;

    const user = share.owner;
    const price = generateShareBuildingPrice(building.price, amount);
    user.money += price;
    user.hourlyIncome -= price / 2;

    if (share.amount === 0) {
        await share.deleteOne();

        let index = building.shares.indexOf(share._id);
        building.shares.splice(index, 1);

        index = user.shares.indexOf(share._id);
        user.shares.splice(index, 1);

        await building.save();
        await user.save();
        return { success: true }
    }

    await share.save();
    await building.save();
    await user.save();
    return { success: true, data: await convertToStandardShare(share) }
};

export async function getSharesByBuildingId(buildingId) {
    try {
        const res = await Share.find({ building: buildingId });

        if (!res) {
            return { success: false, message: "Shares not found" };
        }

        const shares = await Promise.all(res.map(async (share) => {
            return await convertToStandardShare(share);
        }));

        return { success: true, data: shares };
    } catch (error) {
        return { error: true, message: error };
    }
}

export async function getSharesByUserId(userId) {
    try {
        const res = await Share.find({ owner: userId });

        if (!res) {
            return { success: false, message: "Shares not found" };
        }

        const shares = await Promise.all(res.map(async (share) => {
            return await convertToStandardShare(share);
        }));

        return { success: true, data: shares };
    } catch (error) {
        return { error: true, message: error };
    }
}