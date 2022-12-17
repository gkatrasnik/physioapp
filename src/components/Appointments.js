    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../auth";
    import { Container, Form } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'
    import LoadingModal from "./modals/LoadingModal";

    import NewAppointmentModal from './modals/NewAppointmentModal';
    import AppointmentModal from './modals/AppointmentModal';
    
    const Appointments = () => {
        const auth = useAuth();
        const localizer = momentLocalizer(moment)
        const [eventList, setEventList] = useState([]);
        const [filteredEventList, setFilteredEventList] = useState([]);
        const [patientsData, setPatientsData] = useState([]);
        const [showAppointmentModal, setShowAppointmentModal] = useState(false);
        const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
        const [currentEvent, setCurrentEvent] = useState(null);
        const [selectedSlot, setSelectedSlot] = useState(null);
        const [loading, setLoading] = useState(false);
        const [filterEvents, setFilterEvents] = useState(false);

        
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
            

        const eventStyleGetter = (event, start, end, isSelected) => {

            console.log("eveeent", auth.user.id)
            let backgroundColor = event.user_id === auth.user.id ? "#0051ff" :"#00a1cc";//"#0051ff" : "00caff";
            let fontColor =  "white";
            let style = {
                backgroundColor: backgroundColor,
                borderRadius: '0px',                
                color: fontColor,             
            };
            return {
                style: style
            };
        }
        
    
    
        const getEvents = async () => {
            setLoading(true);
            const queryData = await supabase
                .from('appointments')
                .select()
                .eq("rec_deleted", false)
            if (queryData.error) {
                setLoading(false);
                alert(queryData.error.message);                
            }else {
                setLoading(false);
                queryData.data.forEach(event => {
                    event.start = moment(event.start).toDate();
                    event.end = moment(event.end).toDate();
                });
                setEventList(queryData.data);
            }     
        }
    
        const getPatients = async () => {  
            setLoading(true);
            const queryData = await supabase
                .from('patients')
                .select()
                .eq("rec_deleted", false)
            if (queryData.error) {
                setLoading(false);
                alert(queryData.error.message);
            }
            setLoading(false);
            setPatientsData(queryData.data);               
        }

        //filter event list to only contain my events
        const filterEventList = async() => {
            console.log("filter events: ", filterEvents)
            if (filterEvents) { // if switch is turned ON
                const newArr =  eventList.map((event) => {
                    //if event user_id = me, push to cloned arr
                    if (event.user_id === auth.user.id) {
                        return event;
                    }
                })

                setFilteredEventList(newArr);

            } else { //if switch turned OFF
                setFilteredEventList(eventList)
            }
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

        //in event change or switch change filter events
        useEffect(() => {
          filterEventList();
        }, [filterEvents, eventList])
        
    
        return (
            <>
            {loading && <LoadingModal />}

            <Layout>
                <Container className="min-h-100-without-navbar">
                    <h1 className='text-center page-heading'>Appointments</h1> 
                    <Form>
                        <Form.Check 
                            defaultValue={filterEvents}
                            type="switch"
                            id="custom-switch"
                            label="Show only my appointments"
                            onChange={()=>{setFilterEvents(!filterEvents)}}
                            className="my-appointments-switch"
                        />
                    </Form>
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
                        events={filteredEventList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={(eventStyleGetter)}
                        longPressThreshold={250} 
                        selectable
                        />
                    </div>
                </Container>                    
            </Layout>
            </>
        );
    };
    
    export default Appointments;