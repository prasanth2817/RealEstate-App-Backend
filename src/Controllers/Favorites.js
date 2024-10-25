import FavoriteModel from "../Models/Favorites.js";
import UserModel from "../Models/Users.js";
import PropertyModel from "../Models/Properties.js";

// Add to favorites
const addFavorite = async (req, res) => {
  const { userId, propertyId } = req.body;

  try {
    // Check if the property exists before adding to favorites
    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the property is already in the user's favorites
    const existingFavorite = await FavoriteModel.findOne({ user: userId, property: propertyId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    // Create and save the new favorite
    const newFavorite = new FavoriteModel({ user: userId, property: propertyId });
    const savedFavorite = await newFavorite.save();

    // Update user with the favorite item reference
    user.favorites.push(savedFavorite._id);
    await user.save();

    res.status(201).json({ message: "Added to favorites", favorite: savedFavorite });
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites", error });
  }
};

// Get all favorites of a user
const getFavorites = async (req, res) => {
  const { userId } = req.params;
console.log(userId);
  try {
    const userFavorites = await FavoriteModel.find({ user: userId })
      .populate('property')
      .exec();

    res.status(200).json(userFavorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  const { userId, favoriteId } = req.params;

  try {
    const favorite = await FavoriteModel.findByIdAndDelete(favoriteId);

    if (favorite) {
      // Update user favorites
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { favorites: favoriteId },
      });
      res.status(200).json({ message: "Removed from favorites" });
    } else {
      res.status(404).json({ message: "Favorite not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing from favorites", error });
  }
};

export default {
  addFavorite,
  getFavorites,
  removeFavorite,
};
