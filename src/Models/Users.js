import mongoose from "./index.js";

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

const UserSchema = new mongoose.Schema({
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
    favorites: 
    [{ type: mongoose.Schema.Types.ObjectId,
       ref: "favorites",
     }],
    role: {
      type: String,
      default: "User",
    },
    profilePic: {
      type: String,
      default: "",
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    Collection: "Users",
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
