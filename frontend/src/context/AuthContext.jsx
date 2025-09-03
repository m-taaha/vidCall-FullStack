import axios, { HttpStatusCode } from "axios";
import { Children, createContext, useContext, useState } from "react";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const router = useNavigate();

  const [userData, setUserData] = useState(authContext);

  //handleRegister
  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
      });

      if (request.status === HttpStatusCode.Created) {
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  //handleLogin
  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });
      if (request.status === HttpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        router("/"); // redirect to homepage
      }
    } catch (error) {
      throw error;
    }
  };

  const data = {
    userData,
    setuserData,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
