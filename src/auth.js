import {supabase} from "./supabase";
import {useState, useEffect, useContext, createContext} from "react";

const authContext = createContext();

export const AuthProvider = ({children}) => {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProvideAuth() {
    const [user, setUser] = useState(null)

    const signup = async (email, password) => {
        const {error, user} = await supabase.auth.signUp({
            email : email,
            password: password
        })

        if(error) {
            console.log(error)
        }

        return {error, user}
    }
    
    const login = async (email, password) => {
        const {error, user} = await supabase.auth.signInWithPassword({
            email : email,
            password: password
        })

        if(error) {
            console.log(error)
        }

        return {error, user}
    }

    const logout = async () => {
        const {error} = await supabase.auth.signOut()

        if(error) {
            console.log(error)
        }

        setUser(null)
    }

    const resetPassword = async (email) => {
        const {error, user} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/update-password', //TODO change hardcoded link for production
        })

        if(error) {
            console.log(error)
        }

        return {error, user}
    }

     const updatePassword = async (newPassword) => {
        const {error, user} = await supabase.auth.updateUser({password: newPassword })

        if(error) {
            console.log(error)
        }

        return {error, user}
    }

    useEffect(() => {        

        const auth = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session.user)
            }

            if (event === 'SIGNED_OUT') {
                setUser(null)
            }            
            
        })

        return () => auth.data.subscription.unsubscribe()

    }, [])

  

    return {
        user,
        signup,
        login,
        logout,
        resetPassword,
        updatePassword
    }

}