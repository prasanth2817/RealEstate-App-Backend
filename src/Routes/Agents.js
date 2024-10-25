import express from "express";
import AgentController from "../Controllers/Agents.js";

const router = express.Router();
router.use("/register", AgentController.createAgent);
router.use("/login", AgentController.Login);
router.use("/forget-password", AgentController.forgotPassword);
router.use("/reset-passsword", AgentController.resetPassword);

export default router;
