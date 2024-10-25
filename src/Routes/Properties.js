import express from "express";
import PropertyController from "../Controllers/Properties.js";
import parser from "../Config/multerConfig.js";
import Auth from "../Common/Auth.js";

const router = express.Router();

router.post(
  "/create",
  Auth.validate,
  Auth.validateAgent,
  parser.array("images"),
  PropertyController.CreateProperty
);
router.get("/search", Auth.validate, PropertyController.SearchProperty);
router.get(
  "/agent/:agentId",
  Auth.validate,
  Auth.validateAgent,
  PropertyController.GetPropertyByAgentId
);
router.get(
  "/:id",
  Auth.validate,
  PropertyController.GetPropertyById
);
router.get("/", Auth.validate, PropertyController.GetAllProperties);
router.put(
  "/:id",
  Auth.validate,
  parser.array("images"),
  PropertyController.EditProperty
);
router.delete("/:id", Auth.adminGaurd, PropertyController.DeleteProperty);
router.patch(
  "/status/:id",
  Auth.validate,
  PropertyController.UpdatePropertyStatus
);

export default router;
