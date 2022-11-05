

import React, {useState} from 'react';
import Layout from "./Layout";
import {useAuth} from "../auth";

const Appointments = () => {
    const auth = useAuth();
  


    return (
        <Layout>
          
            <h1>Appointments</h1>           
        </Layout>

    );
};

export default Appointments;