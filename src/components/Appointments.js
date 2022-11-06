

import React, {useState} from 'react';
import Layout from "./Layout";
import {useAuth} from "../auth";
import { Container } from 'react-bootstrap';

const Appointments = () => {
    const auth = useAuth();
  


    return (
        <Layout>
            <Container>
                <h1 className='text-center'>Appointments</h1>   
            </Container>                    
        </Layout>

    );
};

export default Appointments;