import React, {useState, useEffect} from 'react';
import { Form, Button, Card } from "react-bootstrap";
import {Lock, Unlock } from "react-bootstrap-icons";



const AppSettings = (props) => {
    
    const [showEventsFromSetting, setShowEventsFromSetting] = useState("");
    const [showIssuesFromSetting, setShowIssuesFromSetting] = useState("");
    const [emailLanguage, setEmailLanguage] = useState("");
    const [editing, setEditing] = useState(false);
   
    const toggleEditing = () => {
        setEditing(!editing);
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
        <h2 className='text-center mt-4 mb-4'>Settings</h2>
        <Card className="mt-4">
            <Card.Body>
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

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
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

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
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
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <div className="d-flex flex-direction-col">
                            <Form.Label className="options-label">Clear cache to get latest version of the app</Form.Label>
                            <Button style={{width:"200px"}} variant="secondary"  onClick={() => {
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
                        </div>
                    </Form.Group>            
                </Form>
            </Card.Body>
        </Card>
    </>
                
    
  );
};

export default AppSettings;