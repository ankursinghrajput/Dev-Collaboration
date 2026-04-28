const mongoose = require("mongoose");
const connRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["interested", "not_interested", "accepted", "rejected"] },
}, { timestamps: true });
connRequestSchema.index({ sender: 1, receiver: 1 }); // Using indexing for faster query on sender and receiver
module.exports = mongoose.model("ConnRequest", connRequestSchema);