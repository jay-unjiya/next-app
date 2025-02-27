import mongoose from "mongoose";

const items = mongoose.models.items || mongoose.model('items', new mongoose.Schema({
    name: String,
    price: Number,
}));

export default items