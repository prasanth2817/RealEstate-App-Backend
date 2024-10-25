import express from "express";
import favoriteController from "../Controllers/Favorites.js";
import Auth from "../Common/Auth.js";

const router = express.Router();

router.post("/create", Auth.validate, favoriteController.addFavorite);
router.get("/:userId", Auth.validate, favoriteController.getFavorites);
router.delete(
  "/:userId/:favoriteId",
  Auth.validate,
  favoriteController.removeFavorite
);

export default router;
