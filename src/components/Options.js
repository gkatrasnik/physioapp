import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../contexts/auth";
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
    const [showEventsFromSetting, setShowEventsFromSetting] = useState(null);

    

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

    const handleGetEventsFrom = () => {
        let setting = localStorage.getItem("showEventsForXMonths");

        if (!setting) {
            setting = 1;                

            localStorage.setItem("showEventsForXMonths", setting);
            console.log("no showEventsForXMonths setting found, setting now to: ", setting);
        } else {
            console.log("showEventsForXMonths found: ", setting);
        }
               
        setShowEventsFromSetting(setting);        
    }

    const handleSetEventsFrom = (newValue) => {        
        setShowEventsFromSetting(newValue);   
        localStorage.setItem('showEventsForXMonths', newValue);
    }

    useEffect(() => {
        handleGetEventsFrom();
    }, [])

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
                    <Form>
                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                            <Form.Label>Show appointments for last ({showEventsFromSetting}) months</Form.Label>
                            <Form.Range
                                name="intensity"
                                min={1}
                                max={12}
                                value={showEventsFromSetting}
                                disabled={false}
                                onChange={(e) => {
                                    handleSetEventsFrom(e.target.valueAsNumber);
                                }}
                            />                
                        </Form.Group>
                    </Form>                  
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
