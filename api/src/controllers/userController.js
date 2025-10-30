import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { getSharesByUserId } from './shareController.js';

async function convertToStandardUser(user) {
    const res = await getRank(user._id);
    const rank = res.data;

    return {
        id: user._id,
        email: user.email,
        username: user.username,
        money: user.money,
        buildingCount: user.shares.length,
        hourlyIncome: user.hourlyIncome,
        rank: rank
    };
}

export async function createUser(body) {
    try {
        await User.init();
        const newUser = new User(
            {
                email: body.email,
                username: body.username,
                passwordHash: body.passwordHash
            }
        );
        await newUser.save();
        return {
            success: true,
            data: await convertToStandardUser(newUser)
        };
    } catch (error) {
        return {
            error: true,
            message: error
        };
    }
}

export async function getUserByEmail(email) {
    const userFound = await User.findOne({ email: email });

    if (userFound) {
        return {
            success: true,
            user: await convertToStandardUser(userFound),
            passwordHash: userFound.passwordHash
        };
    }

    return {
        success: false
    };
}

export async function userHasAuthenticated(id) {
    const user = await User.findById(id);

    const previousDate = new Date(user.lastConnection);
    const currentDate = new Date();

    const millisecondDiff = Math.abs(currentDate.getTime() - previousDate.getTime());
    const hourDiff = Math.floor(((millisecondDiff / 1000) / 60) / 60);

    const moneyToAdd = user.hourlyIncome * hourDiff;
    user.money += user.hourlyIncome * hourDiff;

    user.lastConnection = currentDate.toISOString();
    await user.save();

    return await convertToStandardUser(user);
}

export async function getRawUserById(id) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        return {
            success: true,
            data: await User.findById(id)
        };
    } catch (error) {
        return {
            error: true,
            message: error
        };
    }
}

export async function getUserById(id) {
    const res = await getRawUserById(id);
    if (!res.success) {
        return res;
    }

    return {
        success: true,
        data: await convertToStandardUser(res.data)
    };
}

export async function getShares(userId) {
    const res = await getRawUserById(userId);
    if (!res.success) {
        return res;
    }

    const shares = getSharesByUserId(res.data.shares);
    return {
        success: true,
        data: shares
    };

}

export async function getRanks() {
    const res = User.find().sort({ hourlyIncome: -1 }).limit(500);
    const users = await res;
    return {
        success: true,
        data: await Promise.all(users.map(convertToStandardUser))
    };

}

export function generateToken(id) {
    return jwt.sign({ id: id }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
}

export function authenticateToken(req, res, next) {
    const auth = req.get('Authorization');
    const token = auth && auth.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

async function getRank(id) {
    const res = await User.find().sort({ hourlyIncome: -1 }).limit(500);
    const users = await res;

    for (let i = 0; i < users.length; i++) {
        if (users[i]._id.toString() == id.toString()) {
            const rank = i + 1;
            return { success: true, data: rank + "" };
        }
    }

    return { success: true, data: "500+" };

} 