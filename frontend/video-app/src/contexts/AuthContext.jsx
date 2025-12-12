import { Password, Token } from "@mui/icons-material";
import httpStatus from "http-status";
import axios, { HttpStatusCode } from "axios"; //used to make http requests
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//context = global storage/variable
//every component inside provider can access this now
//<AuthContext.provider value = {{user}}> <App/> </AuthContext.Provider>
//wrapping it
const AuthContext = createContext({});

//axios to call backend api
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
      });

      return request.data.message;
    } catch (err) {
      return err.response?.data?.message || "Something went wrong";
    }
  };
  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });
      console.log("Login return value:", request);
      if (request.status === httpStatus.OK) {
        const token = request.data.token;
        localStorage.setItem("token", token);
        return "OK";
      }
    } catch (err) {
      console.log(err.message);
      return err.response?.data?.message || "Login failed";
    }
  };

  const getHistoryOfUser = async () => {
    try {
      let req = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      console.log(req.data.data);
      return req.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let req = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meetingCode: meetingCode,
        date: Date.now(),
      });
      if (req.status === httpStatus.CREATED) {
        console.log("added to histroy");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
