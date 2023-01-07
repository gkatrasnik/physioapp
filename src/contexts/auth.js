import {supabase} from "../supabase";
import {useState, useEffect, useContext, createContext} from "react";

const authContext = createContext();

export const AuthProvider = ({children}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [userObj, setUserObj] = useState(null);

    const signup = async (email, password, data) => {
        const {error, user} = await supabase.auth.signUp({
            email : email,
            password: password,
            options: {
                data: data
            }
        })

        if(error) {
            alert(error);
        }

        return {error, user}
    }
    
    const login = async (email, password) => {
        const {error, user} = await supabase.auth.signInWithPassword({
            email : email,
            password: password
        })

        if(error) {
            alert(error);
        }

        return {error, user}
    }

    const logout = async () => {
        const {error} = await supabase.auth.signOut();

        if(error) {
            alert(error);
        }

        setUser(null);
    }

    const resetPassword = async (email) => {
        const {error, user} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://physioapp.netlify.app/update-password', //TODO change hardcoded link for production
        })

        if(error) {
            alert(error);
        }

        return {error, user}
    }

     const updatePassword = async (newPassword) => {
        const {error, user} = await supabase.auth.updateUser({password: newPassword })

        if(error) {
            alert(error);
        }

        return {error, user}
    }

    //get user data from public.users 
    const getUserData = async (sessionUser) => {     
        const queryData = await supabase
            .from('users')
            .select()            
            .eq("id", sessionUser.id)
            .limit(1)
            .single()
        if (queryData.error) {            
            alert(queryData.error.message);
        } else {
            setUserObj(queryData.data)
        }                      
    }

    //update user metadata
    const updateUserMetadata = async(data) => {
        const {error, user} = await supabase.auth.updateUser({
            data: {...data}
        })

        if(error) {
            alert(error);
        }

        return {error, user}
    }
    


    useEffect(() => {        
        const auth = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                getUserData(session.user);
                setUser(session.user);
            }

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setUserObj(null);
            }            
            
        })

        return () => auth.data.subscription.unsubscribe();
    }, [])

  

    return {
        user,
        userObj,
        signup,
        login,
        logout,
        resetPassword,
        updatePassword,
        updateUserMetadata
    }

}