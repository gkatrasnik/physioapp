    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../contexts/auth";
    import {useAppData} from "../contexts/appDataContext";
    import { Container, Form, Button } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'
    import 'moment/locale/en-gb'; 
    import LoadingModal from "./modals/LoadingModal";
    import Select from 'react-select';
    import NewAppointmentModal from './modals/NewAppointmentModal';
    import AppointmentModal from './modals/AppointmentModal';
    
    const Appointments = () => {
        const auth = useAuth();        
        const appData= useAppData();

        const localizer = momentLocalizer(moment)
        const [eventList, setEventList] = useState([]);
        const [filteredEventList, setFilteredEventList] = useState([]);
        const [showAppointmentModal, setShowAppointmentModal] = useState(false);
        const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
        const [currentEvent, setCurrentEvent] = useState(null);
        const [selectedSlot, setSelectedSlot] = useState(null);
        const [loading, setLoading] = useState(false);
        const [filterEvents, setFilterEvents] = useState(true);
        const [selectedUserId, setSelectedUserId] = useState(auth.userObj.id);

        const [showEventsFrom, setShowEventsFrom] = useState(null);

        const getOldestEventStart = () => {
            let setting = localStorage.getItem("showEventsForXMonths");

            if (!setting) {
                setting = 1;                

                localStorage.setItem("showEventsForXMonths", setting);
                console.log("no showEventsForXMonths setting found, setting now to: ", setting);
            } else {
                console.log("showEventsForXMonths found: ", setting);
            }


            let showFrom = moment().substract(setting,'m').toIsoString();                
            setShowEventsFrom(showFrom);
            console.log("showing from ", showFrom);
        }

        
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
                fontSize: 13       
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
                .gt('start', showEventsFrom)
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
    

        //filter event list to only contain my events
        const filterEventList = async() => {
            if (filterEvents) { // if switch is turned ON
                const newArr =  eventList.filter((event) => {
                    //if event user_id = selected user, push to cloned arr
                    return event.user_id === selectedUserId;
                })
                
                setFilteredEventList(newArr);

            } else { //if switch turned OFF
                setFilteredEventList(eventList)
            }
        }
        
        
        useEffect(() => {
            getEvents();
            window.scrollTo(0, 0);
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
                        <Form className="mx-2">
                            <Form.Check 
                                checked={filterEvents}
                                type="switch"
                                id="custom-switch"
                                label="Filter Appointments"
                                onChange={(e)=>{setFilterEvents(e.target.checked)}}
                                className="custom-filter-switch"
                            />
                        </Form>   
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                ...baseStyles,
                                
                                }),
                                menu: (baseStyles) => ({
                                 ...baseStyles, 
                                 zIndex: 9999
                                })
                            }
                            }                            
                            options={appData.orgUsers}          
                            defaultValue={appData.orgUsers.find((user) => user.id === selectedUserId)}
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
                                     
                     <NewAppointmentModal 
                        selectedSlot={selectedSlot}
                        show={showNewAppointmentModal} 
                        toggleModal={toggleNewAppointmentModal} 
                        getEvents={getEvents}                    
                    />
    
                    <AppointmentModal
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
                        style={{ height: 600 }}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={(eventStyleGetter)}
                        longPressThreshold={250} 
                        selectable
                        defaultView={Views.WEEK}
                        />
                    </div>
                </Container>                    
            </Layout>
            </>
        );
    };
    
    export default Appointments;