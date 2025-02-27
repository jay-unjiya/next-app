import mongoose from "mongoose";

const users = mongoose.models.nextUser || mongoose.model('nextUser', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
}));

export default users