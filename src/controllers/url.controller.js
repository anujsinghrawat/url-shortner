import { Url } from "../models/url.model.js";
import { nanoid } from "nanoid";

function generateShortId(url) {
    // Simple hashing function
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash &= hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Encode integer to base62
    function encodeBase62(num) {
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let encoded = '';
        while (num > 0) {
            const remainder = num % 62;
            encoded = chars[remainder] + encoded;
            num = Math.floor(num / 62);
        }
        return encoded;
    }

    // Generate hash from URL
    const hash = hashCode(url);

    // Encode hash to base62 and take first 7 characters
    const shortId = encodeBase62(hash).slice(0, 8);

    return shortId;
}

// Example usage:
// const url = "https://www.example.com/very-long-url-that-needs-to-be-shortened";
// const shortId = generateShortId(url);
// console.log("Short ID:", shortId);


async function handleGenerateUrl(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400)
            .json({ message: "url is required" });
    }
    // const shortId = nanoid(8);
    const shortId = generateShortId(body.url);

    await Url.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []
    });

    return res.status(201)
        .json({ shortId: shortId });
}

async function handleRedirectUrl(req, res) {
    const shortId = req.params.shortId;

    const url = await Url.findOneAndUpdate(
        { shortId: shortId },
        {
            $push: {
                visitedHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    if (!url) {
        return res.status(404)
            .json({ message: "Url not found" });
    }
    res.redirect(url.redirectUrl);
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId: shortId });
    return res.status(200)
        .json({
            totalClicks: url.visitedHistory.length,
            redirectUrl: url.redirectUrl,
            analytics: url.visitedHistory
        });
}

export {
    handleGenerateUrl,
    handleRedirectUrl,
    handleGetAnalytics
}