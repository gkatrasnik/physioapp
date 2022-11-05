import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";

const Home = () => {
    const auth = useAuth();
    const [userData, setUserData] = useState();

    const getUserData = async (user_id) => {
        const queryData = await supabase
            .from('users')
            .select()
            .eq("auth_user_id", user_id)

        if (queryData.error) {
            console.log(queryData.error.message)
        }
        setUserData(queryData.data);
    }

    useEffect(() => {        
        getUserData(auth.user.id);
    }, [])

    return (
        <Layout>
            <h1>Home</h1>
        </Layout>
    );
};


export default Home;
