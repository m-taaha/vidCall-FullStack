import { createContext, useContext, useEffect, useState} from "react";
import axios from 'axios';



export const AuthContext = createContext();
const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
  withCredentials: true, //allowing cookies to be sent/recieved
});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

// register function
    const register = async (formData) => {
        setLoading(true); 
        try {
            const {confirmPassword, ...registerData} = formData;
          const res =  await client.post("/register", registerData);
            
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

    // logout function
    const logout = async () => {
        setLoading(true);
        try{
            await client.post("/logout");
            setUser(null);
            return { success: true }

        } catch(error) {
            console.log("Logout failed:", error)

            setUser(null);
            return { success: false }
        } finally {
            setLoading(false)
        }
    }


    // checkAuth function - userGetMe route from backend 
    const checkAuth = async () => {
        setLoading(true);
            try{
              const res =  await client.get("/me");
                setUser(res.data.user) //capture the response
                return {success: true}
            } catch (error) {
                setUser(null);
                return {success: false,
                    message: error.response.data.message || "Error in userGetMe"
                };
            } finally{
                setLoading(false);
            }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, register,  login, logout,  loading}}>
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

