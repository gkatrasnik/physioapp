import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container, Card } from 'react-bootstrap';
import LoadingModal from "./modals/LoadingModal"
import {BoxArrowLeft   } from "react-bootstrap-icons";



const Settings = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    return (
        <>
        {loading && <LoadingModal />}
        <Layout>
            <Container>       
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "5rem"}}>                               
                <Card.Body>
                    <Card.Title className='text-center'><h1>Options</h1></Card.Title>                    
                    <Link onClick={auth.logout} className="settings-link"><BoxArrowLeft/><p>Logout</p></Link>                  
                </Card.Body>
                </Card>                          
            </Container>
        </Layout>
        </>
    );
};


export default Settings;
