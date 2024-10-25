import AgentModel from "../Models/Agents.js";
import Auth from "../Common/Auth.js";
import EmailServices from "../Common/EmailServices.js";

const createAgent = async (req, res) => {
  try {
    let email = req.body.email.toLowerCase();

    let agent = await AgentModel.findOne({ email });
    if (!agent) {
      req.body.password = await Auth.hashPassword(req.body.password);
      await AgentModel.create(req.body);
      res.status(201).send({ message: "Account Created sucessfully" });
    } else
      res
        .status(400)
        .send({ message: `agent ${req.body.email} Already Exists` });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    let email = req.body.email.toLowerCase();

    let agent = await AgentModel.findOne({ email });
    if (agent) {
      let hashCompare = await Auth.hashCompare(
        req.body.password,
        agent.password
      );
      if (hashCompare) {
        let token = await Auth.createToken({
          id: agent._id,
          fullName: agent.fullName,
          userName: agent.userName,
          email: agent.email,
          role: agent.role,
        });
        res.status(200).send({ message: "Login successfull", token });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    } else
      res.status(400).send({ message: `agent ${req.body.email} Not Exists` });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const Logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const forgotPassword = async (req, res) => {
  try {
    const agent = await AgentModel.findOne(
      { email: req.body.email },
      { password: 0 }
    );
    if (agent) {
      const token = await Auth.createToken({
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        role: user.role,
        id: agent._id,
      });
      const resetUrl = `https://localhost:8000/reset-password/${token}`;
      const emailContent = {
        to: agent.email,
        subject: "Reset Password Request",
        text: `Dear ${agent.firstName},\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n${resetUrl}`,
        html: `<p>Dear ${agent.firstName},</p><p>We received a request to reset your password. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      };
      await EmailServices.sendMail(emailContent);

      res.status(200).send({
        message: "The password reset link has been sent to your email.",
      });
    } else {
      res.status(400).send({
        message: "Agent not found. Please enter a registered email address.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    let data = await Auth.decodeToken(token);
    if (req.body.newpassword === req.body.confirmpassword) {
      let agent = await AgentModel.findOne({ email: data.email });
      agent.password = await Auth.hashPassword(req.body.newpassword);
      await agent.save();

      res.status(200).send({
        message: "Password Updated Successfully",
      });
    } else {
      res.status(400).send({
        message: "Password Does Not match",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "Invalid or expired token",
    });
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  createAgent,
  Login,
  Logout,
  forgotPassword,
  resetPassword,
};
