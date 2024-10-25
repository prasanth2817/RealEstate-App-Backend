import express from "express";
import UserRoutes from "./Users.js";
import PropertyRoutes from "./Properties.js";
import AgentRoutes from "./Agents.js";
import FavoriteRoutes from "./Favorites.js";

const router = express.Router();

router.use("/user", UserRoutes);
router.use("/property", PropertyRoutes);
router.use("/agents", AgentRoutes);
router.use("/favorites", FavoriteRoutes);

export default router;
