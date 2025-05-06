import { Router } from "express";
import { handleGoogleAuth } from "../controllers/auth.controllers";

const router = Router();

router.post("/google", handleGoogleAuth);

export default router;