import mongoose from "./index.js";

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

const AgentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: validateEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    agencyName: { 
      type: String,
      required: true
     },
    properties:
     [{ type: mongoose.Schema.Types.ObjectId,
       ref: "Properties"
       }],
    role: {
       type: String, 
       default: "Agent" 
      },
    profilePic: {
      type: String,
      default: "",
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    Collection: "Agents",
    versionKey: false,
  }
);

const AgentModel = mongoose.model("Agent", AgentSchema);

export default AgentModel;
