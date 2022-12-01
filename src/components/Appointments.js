    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useCallback, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../auth";
    import { Container,Button } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'
    import "react-big-calendar/lib/css/react-big-calendar.css";
    import NewAppointmentModal from './modals/NewAppointmentModal';
    import AppointmentModal from './modals/AppointmentModal';
    
    const Appointments = () => {
        const auth = useAuth();
        const localizer = momentLocalizer(moment)
        const [eventList, setEventList] = useState([]);
        const [patientsData, setPatientsData] = useState([]);
        const [showAppointmentModal, setShowAppointmentModal] = useState(false);
        const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
        const [currentEvent, setCurrentEvent] = useState(null);
        
    
        
        // implement adding new events/appointments --- handle error in getEvents()
         const handleSelectSlot = () => {
            toggleNewAppointmentModal();
        }
         
        const toggleNewAppointmentModal = () => {
            setShowNewAppointmentModal(!showNewAppointmentModal);
        }   
        
    
        const handleSelectEvent = (event) => {
            //open appointment modal (event)
            setCurrentEvent(event);
            console.log("current event set", event)
        } 
    
        
    
        const hideAppointmentModal = () => {
            setShowAppointmentModal(false);
        }
            
        
    
    
      const getEvents = async () => {
             const queryData = await supabase
                .from('appointments')
                .select()
                .eq("org_id", auth.user.user_metadata.org_id)
            if (queryData.error) {
                alert(queryData.error.message);
            }else {            
                setEventList(queryData.data)
            }     
        }
    
        const getPatients = async () => {  
            const queryData = await supabase
                .from('patients')
                .select()
                .eq("org_id", auth.user.user_metadata.org_id)               
    
            if (queryData.error) {
                alert(queryData.error.message);
            }
            setPatientsData(queryData.data);               
        }
    
    
        
        useEffect(() => {
            getPatients(); 
            getEvents();
        }, [])    
        
        useEffect(()=>{
            if (currentEvent){
                setShowAppointmentModal(true);
            }            
        }, [currentEvent])
    
        return (
            <Layout>
                <Container>
                    <h1 className='text-center'>Appointments</h1>   
                     <NewAppointmentModal 
                        patientsData={patientsData}
                        show={showNewAppointmentModal} 
                        toggleModal={toggleNewAppointmentModal} 
                        getEvents={getEvents}                    
                    />
    
                    <AppointmentModal
                        patientsData={patientsData}
                        currentEvent={currentEvent}
                        hideAppointmentModal={hideAppointmentModal}
                        show={showAppointmentModal}
                        getEvents={getEvents}       
                    />
                    
                    <div className='my-5'>
                        <Calendar
                        localizer={localizer}
                        events={eventList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        />
                    </div>
                </Container>                    
            </Layout>
    
        );
    };
    
    export default Appointments;