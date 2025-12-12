import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import httpStaus from "http-status";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing Credentials" });
  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      //user n  ot found -> throw error code
      return res
        .status(httpStaus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }
    //username exists ->check pw
    let isValid = await bcrypt.compare(password, existingUser.password);
    if (isValid) {
      //give a token
      let token = crypto.randomBytes(20).toString("hex");
      existingUser.token = token;
      await existingUser.save();

      //debug
      console.log("Password entered:", password);
      console.log("Hashed password:", existingUser.password);
      console.log(
        "Compare result:",
        await bcrypt.compare(password, existingUser.password)
      );
      return res.status(httpStaus.OK).json({ token: token });
    } else {
      return res.status(httpStaus.UNAUTHORIZED).json({
        message: "Invalid Password",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: `Oops! ${err}` });
  }
};

const register = async (req, res) => {
  let { name, username, password } = req.body;
  try {
    const isexistingUser = await User.findOne({ username: username });
    if (isexistingUser) {
      //Send an error code to client + message
      return res
        .status(httpStaus.CONFLICT)
        .json({ message: "User Already Exists" });
    }
    //register
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      name: name,
      username: username,
      password: hashedPassword,
    })
      .save()
      .then(console.log("register successful"));
    res.status(httpStaus.CREATED).json({
      message: "register successful",
      data: newUser,
    });
  } catch (err) {
    res.json({ message: `something went wrong ${err}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;
  try {
    let user = await User.findOne({ token: token });
    let meetings = await Meeting.find({
      user_id: user.username,
    });
    console.log(meetings);
    res.status(httpStaus.OK).json({ data: meetings });
  } catch (err) {
    return res.status(httpStaus.NOT_FOUND).json({ message: `Oops! ${err}` });
  }
};

const addToUserHistory = async (req, res) => {
  const { token, meetingCode, date } = req.body;
  try {
    let user = await User.findOne({ token: token });
    let newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meetingCode,
      date: date,
    }).save();
    res.status(httpStaus.CREATED).json({ message: "Added code to history" });
  } catch (err) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export { login, register, getUserHistory, addToUserHistory };
