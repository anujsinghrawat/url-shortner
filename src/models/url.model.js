import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitedHistory: [
        {
            timestamp: {
                type: Date,
                required: true
            }
        }
    ]
},
    {
        timestamps: true

    });

export const Url = mongoose.model("Url", urlSchema);