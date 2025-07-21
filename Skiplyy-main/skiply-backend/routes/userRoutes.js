import express from "express";
import { getProfile, getAllUsers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/", protect, adminOnly, getAllUsers);

export default router;
