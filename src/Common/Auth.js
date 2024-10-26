import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRECT, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
  } catch (error) {
    console.error("Error creating token:", error);
  }
};

const decodeToken = async (token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRECT);
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const validate = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      let payload = await decodeToken(token);
      let currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp > currentTime) {
        req.user = payload;
        next();
      } else {
        res.status(400).send({ message: "Token Expired" });
      }
    } catch (error) {
      res.status(400).send({ message: "Invalid Token" });
    }
  } else {
    res.status(400).send({ message: "No token Found" });
  }
};


const validateAgent = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "agent") {
      next();
    } else {
      return res.status(403).send({ message: "Only Agents are allowed" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Authorization error" });
  }
};

const adminGaurd = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    let payload = await decodeToken(token);
    if (payload.role === "admin") next();
    else res.status(401).send({ message: "Only Admins are allowed" });
  } else {
    res.status(401).send({ message: "No Token Found" });
  }
};

export default {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  adminGaurd,
  validateAgent,
};
