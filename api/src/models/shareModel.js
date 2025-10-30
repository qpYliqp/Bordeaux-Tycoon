import { Schema, model } from "mongoose";

const shareSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    building: { type: Schema.Types.ObjectId, ref: 'Building' },
    amount: { type: Number },
});

export default model('Share', shareSchema);