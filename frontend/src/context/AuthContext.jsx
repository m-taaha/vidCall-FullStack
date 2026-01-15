import { createContext, useContext, useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext();
const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const navigatge = useNavigate();

// register function
    const register = async (formData) => {
        setLoading(true); 
        try {
            
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                username: formData.username,
                email: formData.email,
                password: formData.password
            };

            await client.post("/register", payload);
            
            setUser(res.data.user);
            return {success: true}

        } catch(error) {
            return { success: false, 
                message: error.response?.data.message || "Registration failed"
            }
        } finally {
            setLoading(false)
        }
    }

// login function 
    const login = async ({email, password}) => {
        setLoading(true);
        try {
            const res = await client.post("/login", {email, password});
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthContext.Provider value={{user, register,  login, loading , navigatge }}>
            {children}
        </AuthContext.Provider>
    )
}