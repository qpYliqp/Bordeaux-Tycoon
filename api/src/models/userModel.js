import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    email: { type: String, unique: true },
    username: { type: String },
    passwordHash: { type: String },
    money: { type: Number, default: 10000 },
    shares: [
        { type: Schema.Types.ObjectId, ref: 'Share' }
    ],
    lastConnection: { type: String, default: new Date().toISOString() },
    hourlyIncome: { type: Number, default: 0 }
})

export default model('User', userSchema)