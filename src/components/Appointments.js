    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../auth";
    import { Container, Form, Button } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'
    import LoadingModal from "./modals/LoadingModal";
    import Select from 'react-select';
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
        const [usersData, setUsersData] = useState([]);
        const [selectedUserId, setSelectedUserId] = useState(null);

        
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

            let backgroundColor = event.user_id === auth.userObj.id ? "#0272EC" :"#6c757d";//"#0051ff" : "00caff";            
            let style = {
                backgroundColor: backgroundColor,                               
                color: "white",             
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

        //therapsis data
        const getUsers = async () => {  
            setLoading(true); 
            const queryData = await supabase
                .from('users')
                .select()
                .eq("rec_deleted", false)
            if (queryData.error) {
                setLoading(false); 
                alert(queryData.error.message);
            } else {
                setLoading(false); 
                setUsersData(queryData.data);     
            }
                  
        }

        //filter event list to only contain my events
        const filterEventList = async() => {
            if (filterEvents) { // if switch is turned ON
                const newArr =  eventList.filter((event) => {
                    //if event user_id = selected user, push to cloned arr
                    console.log("event userid: ", event.user_id, " , selecteduserid: ", selectedUserId)
                    return event.user_id === selectedUserId;
                })
                
                setFilteredEventList(newArr);

            } else { //if switch turned OFF
                setFilteredEventList(eventList)
            }
        }
        
        
        useEffect(() => {
            getPatients(); 
            getEvents();
            getUsers();
            setSelectedUserId(auth.userObj.id)
            console.log("useeffect load, auth user onj id", auth.userObj.id)
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

        //in event change or switch change, or selected user switch filter events
        useEffect(() => {
          filterEventList();
        }, [filterEvents, eventList, selectedUserId])
        
    
        return (
            <>
            {loading && <LoadingModal />}

            <Layout>
                <Container className="min-h-100-without-navbar">
                    <h1 className='text-center custom-page-heading-1 mt-5 mb-4'>Appointments</h1> 
                    <div className='buttons-container'>
                            <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                ...baseStyles
                                }),
                            }}
                            options={usersData}          
                            defaultValue={usersData.find((user) => user.id === auth.userObj.id)}
                            getOptionLabel={(option)=>option.name}
                            getOptionValue={(option)=>option.id}                    
                            onChange={(option) => {
                                setSelectedUserId(option.id);
                            }}
                        >
                        </Select>  
                        <Button  className="ms-2 my-2" variant="secondary" onClick={toggleNewAppointmentModal}>
                                New Appointment
                        </Button>
                    </div>
                    <Form>
                        <Form.Check 
                            checked={filterEvents}
                            type="switch"
                            id="custom-switch"
                            label="Show only my appointments"
                            onChange={()=>{setFilterEvents(!filterEvents)}}
                            className="custom-filter-switch"
                        />
                    </Form>                    
                     <NewAppointmentModal 
                        selectedSlot={selectedSlot}
                        patientsData={patientsData}
                        usersData={usersData}  
                        show={showNewAppointmentModal} 
                        toggleModal={toggleNewAppointmentModal} 
                        getEvents={getEvents}                    
                    />
    
                    <AppointmentModal
                        patientsData={patientsData}
                        usersData={usersData}  
                        currentEvent={currentEvent}
                        hideAppointmentModal={hideAppointmentModal}
                        show={showAppointmentModal}
                        getEvents={getEvents}       
                    />
                    
                    <div className='my-3'>
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