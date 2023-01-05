import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container, Card, Button } from 'react-bootstrap';
import LoadingModal from "./modals/LoadingModal"
import {BoxArrowLeft, Person, Building } from "react-bootstrap-icons";
import UserInfoModal from './modals/UserInfoModal';



const Options = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [showManageOrg, setShowManageOrg] = useState(false);

    

    const handleHideUserInfoModal = () => {
        setShowUserInfoModal(false);
    }

    const handleShowUserInfoModal = () => { 
        setShowUserInfoModal(true);                      
    }

    const handleHideManageOrgModal = () => {
        setShowManageOrg(false);
    }

    const handleShowManageOrgModal = () => { 
        setShowManageOrg(true);                      
    }

    return (
        <>
        {loading && <LoadingModal />}
        <Layout>            
            <Container>
                <UserInfoModal
                    show={showUserInfoModal}
                    hideModal={handleHideUserInfoModal}    
                />       
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "5rem"}}>                               
                <Card.Body>
                    <Card.Title className='text-center'><h1>Options</h1></Card.Title>                    
                    <Link onClick={handleShowUserInfoModal} className="options-link"><Person/><p>My Info</p></Link>
                    {auth.userObj.org_admin && <Link onClick={handleShowManageOrgModal} className="options-link"><Building/><p>Manage Organization</p></Link>}
                    <Link onClick={auth.logout} className="options-link"><BoxArrowLeft/><p>Logout</p></Link>          
                        
                </Card.Body>      
                </Card>                          
            </Container>
        </Layout>
        </>
    );
};


export default Options;
