import mongoose from "./index.js";

const PropertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [true, "Property Name is required"],
    },
    propertyType: {
      type: String,
      required: [true, "property Type is required"],
      enum: ["apartment", "house", "commercial", "land", "villa"],
    },
    location: {
      type: String,
      required: [true, "Property Location is required"],
    },
    price: { type: Number, required: [true, "Property Price is required"] },
    description: {
      type: String,
      required: [true, "Property Description is required"],
    },
    PropertyStatus: {
      type: String,
      default: "Not Sold",
      enum: ["Not Sold", "Property Sold"],
    },
    images: [{ type: String }],
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
  },
  {
    collection: "Properties",
    versionKey: false,
  }
);

const PropertyModel = mongoose.model("Properties", PropertySchema);

export default PropertyModel;
