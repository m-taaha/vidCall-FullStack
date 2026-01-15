import { createContext, useContext, useState} from "react";
import axios from 'axios';



export const AuthContext = createContext();
const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
  withCredentials: true, //allowing cookies to be sent/recieved
});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

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

          const res =  await client.post("/register", payload);
            
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
            return { success: false,
                message: error.response?.data.message || "Login failed"
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthContext.Provider value={{user, register,  login, loading}}>
            {children}
        </AuthContext.Provider>
    )
}




    // custom hook to easily use the context
    export const useAuth = () => {
        const context = useContext(AuthContext);

        if(context === undefined) {
            throw new Error("useAuth must be used within an AuthProvider");
        }
        return context;
    }

