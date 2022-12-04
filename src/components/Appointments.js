    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useCallback, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../auth";
    import { Container,Button } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'
    
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
        const [selectedSlot, setSelectedSlot] = useState(null);
    
        
         const handleSelectSlot = (slot) => {
            setSelectedSlot(slot)            
        }
         
        const toggleNewAppointmentModal = () => {
            setShowNewAppointmentModal(!showNewAppointmentModal);
        }   
        
    
        const handleSelectEvent = (event) => {
            //open appointment modal (event)
            setCurrentEvent(event);
        } 
            
    
        const hideAppointmentModal = () => {
            setShowAppointmentModal(false);
            setCurrentEvent(null);
        }
            
        
    
    
        const getEvents = async () => {
             const queryData = await supabase
                .from('appointments')
                .select()
                .eq("org_id", auth.user.user_metadata.org_id)
                .eq("rec_deleted", false)
            if (queryData.error) {
                alert(queryData.error.message);
            }else {
                queryData.data.forEach(event => {
                    event.start = moment(event.start).toDate();
                    event.end = moment(event.end).toDate();
                });
                setEventList(queryData.data);
            }     
        }
    
        const getPatients = async () => {  
            const queryData = await supabase
                .from('patients')
                .select()
                .eq("org_id", auth.user.user_metadata.org_id)               
                .eq("rec_deleted", false)
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

        useEffect(() => {
          if (selectedSlot) {
            toggleNewAppointmentModal();
          }
        }, [selectedSlot])
        
    
        return (
            <Layout>
                <Container>
                    <h1 className='text-center'>Appointments</h1>   
                     <NewAppointmentModal 
                        selectedSlot={selectedSlot}
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
                        longPressThreshold={250} 
                        selectable
                        />
                    </div>
                </Container>                    
            </Layout>
    
        );
    };
    
    export default Appointments;