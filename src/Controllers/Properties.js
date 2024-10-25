import PropertyModel from "../Models/Properties.js";

const CreateProperty = async (req, res) => {
  try {
    // Check if file exists in the request
    if (!req.files || !req.files.length) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    if (!req.user) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    // Destructure fields from the request body
    const { propertyName, propertyType, location, price, description } =
      req.body;
    const agentId = req.user.id;

    const missingFields = [];
    if (!propertyName) missingFields.push("propertyName");
    if (!propertyType) missingFields.push("propertyType");
    if (!location) missingFields.push("location");
    if (!price) missingFields.push("price");
    if (!description) missingFields.push("description");
    if (!agentId) missingFields.push("agentId");

    // Check if any required field is missing
    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Required fields are missing: ${missingFields.join(", ")}`,
      });
    }

    // Handle image paths (assuming req.files is an array of file objects)
    const imagePaths = req.files.map((file) => file.path);
    const newProperty = new PropertyModel({
      propertyName,
      propertyType,
      location,
      price,
      description,
      agentId,
      images: imagePaths,
    });
    // Save the new Store to the database
    await newProperty.save();
    res.status(201).send({
      message: "Property Added Successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error:", error);
    // Send error response
    res.status(500).send({
      error: error.message,
      message: "Error in creating Property",
    });
  }
};

const GetPropertyByAgentId = async (req, res) => {
  try {
    const property = await PropertyModel.find({ agentId: req.params.agentId });
    if (!property) {
      return res.status(404).send({ message: "Property not found" });
    }
    res.status(200).send(property);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in getting property",
    });
  }
};

const GetPropertyById = async (req, res) => {
    try {
      const property = await PropertyModel.findById(req.params.id);
      if (!property) {
        return res.status(404).send({ message: "Property not found" });
      }
      res.status(200).send(property);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        error: error.message,
        message: "Error in getting property",
      });
    }
  };

const GetAllProperties = async (req, res) => {
  try {
    // Fetch all properties from the database
    const properties = await PropertyModel.find({});

    // Check if properties are found
    if (properties.length === 0) {
      return res.status(404).send({ message: "No properties found" });
    }

    // Send the list of properties
    res.status(200).send(properties);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in retrieving properties",
    });
  }
};

const EditProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const { propertyName, propertyType, location, price, description } =
      req.body;
    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : undefined;

    // Find the existing property to retain old images if no new images are provided
    const existingProperty = await PropertyModel.findById(id);

    if (!existingProperty) {
      return res.status(404).send({ message: "Property not found" });
    }

    // Find and update the property
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      {
        propertyName,
        propertyType,
        location,
        price,
        description,
        images: imagePaths ? imagePaths : existingProperty.images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).send({ message: "Property not found" });
    }

    res.status(200).send({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in updating property",
    });
  }
};

const DeleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    // Find and delete the property
    const deletedProperty = await PropertyModel.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).send({ message: "Property not found" });
    }

    res.status(200).send({
      message: "Property deleted successfully",
      property: deletedProperty,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in deleting property",
    });
  }
};

const UpdatePropertyStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    // Validate the status
    if (!status) {
      return res.status(400).send({ message: "Property status is required" });
    }

    // Find and update the property status
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      { PropertyStatus: status },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).send({ message: "Property not found" });
    }

    res.status(200).send({
      message: "Property status updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in updating property status",
    });
  }
};

const SearchProperty = async (req, res) => {
  try {
    const { query, propertyType, minPrice, maxPrice } = req.query;
    const filters = {};

    // Handle search query
    if (query) {
      filters.$or = [
        { propertyName: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ];
    }

    // Handle property type filter
    if (propertyType) filters.propertyType = propertyType;

    // Handle price filters
    if (minPrice && maxPrice) {
      filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filters.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filters.price = { $lte: Number(maxPrice) };
    }

    // Fetch properties based on filters
    const properties = await PropertyModel.find(filters);
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error searching properties", error: error.message });
  }
};

export default {
  CreateProperty,
  GetPropertyByAgentId,
  GetPropertyById,
  GetAllProperties,
  EditProperty,
  DeleteProperty,
  UpdatePropertyStatus,
  SearchProperty,
};
