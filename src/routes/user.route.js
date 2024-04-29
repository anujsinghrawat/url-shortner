import express from 'express';
import { handleGenerateUrl, handleRedirectUrl, handleGetAnalytics } from "../controllers/url.controller.js";

const router = express.Router();

router.post('/', handleGenerateUrl);
router.get('/:shortId', handleRedirectUrl);

router.get('/analytics/:shortId', handleGetAnalytics);


export { router };