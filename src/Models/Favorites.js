import mongoose from "./index.js";

// Define the schema for the favorites
const FavoriteSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    property: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Properties',
        required: [true, "Favorite property is required"] 
      },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    collection: "Favorites",
    versionKey: false
});

// Create the Favorites model
const FavoriteModel = mongoose.model("Favorites", FavoriteSchema);

export default FavoriteModel;
