import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../contexts/auth";
import Layout from "./Layout";
import { Container, Tab, Tabs  } from 'react-bootstrap';
import {BoxArrowLeft} from "react-bootstrap-icons";
import UserInfo from './UserInfo';
import AppSettings from './AppSettings';
import { useSwipeable } from 'react-swipeable';
import packageJson from '../../package.json';

//for swipable tabs
const config = {
  delta: 50,                            // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
  trackTouch: true,                     // track touch input
  trackMouse: false,                    // track mouse input
  rotationAngle: 0,                     // set a rotation angle
}

const tabs = ["App", "My Info", "Organization", "Settings"];

const Options = () => {
    const auth = useAuth();
    const [activeTab, setActiveTab] = useState(tabs.currentTab());


    //swipable tabs
    const handlers = useSwipeable({
      onSwiped: (e) => {
          if(e.dir==="Right") {    
            setActiveTab(tabs.previousTab());  
          }
          else if(e.dir==="Left") {   
            setActiveTab(tabs.nextTab());      
          }          
      }, ...config, });
      
      const handlerSetTab = (i) => {
          setActiveTab(tabs.jumpTab(i));
      }
    

    return (
        <>
        <Layout>            
            <Container className="min-h-100-without-navbar" {...handlers}>
                 <h1 className='text-center custom-page-heading-1 mt-5 mb-4'>Options</h1> 
                <Tabs                     
                    activeKey={activeTab} 
                    onSelect={(tab) => handlerSetTab(tab)}
                    fill                   
                >
                    <Tab title="App" eventKey="App">
                        <h2 className='text-center mt-4 mb-4'>App</h2> 
                        <p className='text-center m-4'>App version: {packageJson.version}</p>
                        <Link onClick={auth.logout} className="options-link"><BoxArrowLeft/><p>Logout</p></Link>
                    </Tab>
                    <Tab title="My Info" eventKey="My Info">
                        <UserInfo/> 
                    </Tab>
                    <Tab title="Organization" eventKey="Organization">
                        
                        <h2 className='text-center mt-4 mb-4'>Organization</h2> 
                        <p className='text-center'>Coming soon...</p>
                    </Tab>
                    <Tab title="Settings" eventKey="Settings">
                        <AppSettings/>
                    </Tab>
                </Tabs>                       
            </Container>
        </Layout>
        </>
    );
};


export default Options;
