import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container } from 'react-bootstrap';

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
            <Container>
                <h1 className='text-center'>Home</h1>
                <h2 className='text-center'>Organization Info</h2>
                <div className='m-5'>
                    <p>Basic Info:</p>
                    <p>Contact: </p>
                    <p>Adress:</p>                
                </div>
            </Container>
        </Layout>
    );
};


export default Home;
