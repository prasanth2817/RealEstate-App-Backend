import express from "express";
import UserController from "../Controllers/Users.js";

const router = express.Router();
router.use("/register", UserController.createUser);
router.use("/login", UserController.Login);
router.use("/logout", UserController.Logout);
router.use("/forget-password", UserController.forgotPassword);
router.use("/reset-passsword", UserController.resetPassword);

export default router;
