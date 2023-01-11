import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../contexts/auth";
import Layout from "./Layout";
import { Container, Card, Button, Form } from 'react-bootstrap';
import LoadingModal from "./modals/LoadingModal"
import {BoxArrowLeft, Person, Building, Lock, Unlock } from "react-bootstrap-icons";
import UserInfoModal from './modals/UserInfoModal';
import packageJson from '../package.json';



const Options = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [showManageOrg, setShowManageOrg] = useState(false);
    const [showEventsFromSetting, setShowEventsFromSetting] = useState("");
    const [showIssuesFromSetting, setShowIssuesFromSetting] = useState("");
    const [emailLanguage, setEmailLanguage] = useState("");
    const [editing, setEditing] = useState(false);

    const toggleEditing = () => {
        setEditing(!editing);
    }

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

    //handling get Events from
    const handleGetEventsFrom = () => {
        let setting = localStorage.getItem("showEventsForXMonths");

        if (!setting) {
            setting = 3;                

            localStorage.setItem("showEventsForXMonths", setting);
            console.log("no showEventsForXMonths setting found, setting now to: ", setting);
        } 
               
        setShowEventsFromSetting(setting);        
    }

    const handleSetEventsFrom = (newValue) => {        
        setShowEventsFromSetting(newValue);   
        localStorage.setItem('showEventsForXMonths', newValue);
    }



    //handling get Issues from
    const handleGetIssuesFrom = () => {
        let setting = localStorage.getItem("showIssuesForXYears");

        if (!setting) {
            setting = 1;                

            localStorage.setItem("showIssuesForXYears", setting);
            console.log("no showIssuesForXYears setting found, setting now to: ", setting);
        } 
            
        setShowIssuesFromSetting(setting);        
    }

    const handleSetIssuesFrom = (newValue) => {        
        setShowIssuesFromSetting(newValue);   
        localStorage.setItem('showIssuesForXYears', newValue);
    }

    //hangle email language
    const handleEmailLang = () => {
        let setting = localStorage.getItem("emailLang");

        if (!setting) {
            setting = "slo";                

            localStorage.setItem("emailLang", setting);
            console.log("no emailLang setting found, setting now to: ", setting);
        } 
                
        setEmailLanguage(setting);
    }

    const handleSetEmailLang = (newValue) => {        
        setEmailLanguage(newValue);   
        localStorage.setItem('emailLang', newValue);
    }


    useEffect(() => {
        handleGetEventsFrom();
        handleGetIssuesFrom();
        handleEmailLang();
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
                <p className='text-center'>App version: {packageJson.version}</p>
                    <Form>
                        <div className='buttons-container'>     
                            {editing ? <Button  className="ms-2 my-2" variant="secondary"  onClick={toggleEditing}>
                                <Unlock/>
                            </Button> :
                            <Button  className="ms-2 my-2" variant="secondary"  onClick={toggleEditing}>
                                <Lock/>
                            </Button>}                          
                        </div>
                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                            <Form.Label className="options-label" >Show appointments for last ({showEventsFromSetting}) months</Form.Label>
                            <Form.Range
                                name="showEventsFrom"
                                min={3}
                                max={12}
                                step={3}
                                value={showEventsFromSetting}
                                disabled={!editing}
                                onChange={(e) => {
                                    handleSetEventsFrom(e.target.valueAsNumber);
                                }}
                            />                
                        </Form.Group>

                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                            <Form.Label className="options-label">Show issues for last ({showIssuesFromSetting}) years</Form.Label>
                            <Form.Range
                                name="showIssuesFrom"
                                min={1}
                                max={20}
                                step={1}
                                value={showIssuesFromSetting}
                                disabled={!editing}
                                onChange={(e) => {
                                    handleSetIssuesFrom(e.target.valueAsNumber);
                                }}
                            />                
                        </Form.Group>

                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                            <Form.Label className="options-label">New appointment email language</Form.Label>
                            <Form.Select aria-label="Default select example"
                                value={emailLanguage}
                                disabled={!editing}
                                onChange={(e) => {
                                    handleSetEmailLang(e.target.value);
                                }}
                            >
                                <option value="slo">Slovenščina</option>
                                <option value="eng">English</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                            <Form.Label className="options-label">Clear cache to get latest version of the app</Form.Label>
                            <Button  className="my-2" variant="secondary"  onClick={() => {
                                caches.keys().then(function(names) {
                                    for (let cacheName of names) {
                                        caches.delete(cacheName);
                                        console.log("Cache deleted: ", cacheName);
                                    }         
                                    
                                    alert("App cache successfuly cleared");
                                });
                                
                            }}>
                                Clear App Cache
                            </Button>

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
