
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Table, Form} from "react-bootstrap";
import moment from 'moment';
import { useAuth } from '../contexts/auth';
import { useAppData } from '../contexts/appDataContext';
import NewAppointmentModal from './modals/NewAppointmentModal';
import AppointmentModal from './modals/AppointmentModal';
import LoadingModal from "./modals/LoadingModal"
import Select from 'react-select';



const AppointmentsList = (props) => {
    const auth = useAuth();
    const appData = useAppData();

    const [eventsList, setEventsList] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEventsList, setFilteredEventsList] = useState([]);
    const [showOnlyUsers, setShowOnlyUsers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(auth.userObj.id);


    const getEvents = async () => {
        if (props.currentPatientData) { //handle if there is o props.currentPatientData
            setLoading(true); 
            const queryData = await supabase
                .from('appointments')
                .select()
                .eq("patient_id", props.currentPatientData.id)
                .eq("rec_deleted", false)
                .order('end', { ascending: false })
            if (queryData.error) {
                setLoading(false); 
                alert(queryData.error.message);
            } else {
                setLoading(false); 
                queryData.data.forEach(event => {
                    event.start = moment(event.start).toDate();
                    event.end = moment(event.end).toDate();
                });
                setEventsList(queryData.data);
            }     
        }
    }

    const isEventPast = (eventEnd) => {
        const now = moment().toDate();
        return eventEnd < now;
    }

    const getDuration = (start, end) => {
        let momentStart = moment(start);
        let momentEnd = moment(end);
        var duration = moment.duration(momentEnd.diff(momentStart));
        return Math.floor(duration.asMinutes());       
    }

    //handle show modals
    const toggleNewAppointmentModal = () => {
        setShowNewAppointmentModal(!showNewAppointmentModal);
    } 
    
    const handleShowApointmentModal = () => {
        setShowAppointmentModal(true);
    }

    const hideAppointmentModal = () => {
        setShowAppointmentModal(false);
        setCurrentEvent(null);
    }

    const getUserName = (userId) => {
        const userObj = appData.orgUsers.find(user => user.id === userId);
        return userObj ? userObj.name : "Unknown";
    }

    const handleSearch = () => {   
            if (searchQuery.length === 0) { //show all events 
                if (showOnlyUsers) {
                    const usersEvents =  eventsList.filter((event) => {                        
                        return event.user_id === selectedUserId;
                    })
                    setFilteredEventsList(usersEvents)
                } else {
                    setFilteredEventsList(eventsList);
                }
                
            } else if (searchQuery.length) {//auto filter events when typing in search  

                if (showOnlyUsers) {//show filtered by search + mine
                    const myFileredEvents = eventsList.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()) && event.user_id === selectedUserId);
                    setFilteredEventsList(myFileredEvents);

                } else { //show only filtered by search
                    const filteredEvents = eventsList.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
                    setFilteredEventsList(filteredEvents);
                }
                
            }
    }

    useEffect(() => { //on search query change, handle search
        handleSearch(searchQuery);
    }, [eventsList, searchQuery, showOnlyUsers, selectedUserId])

    useEffect(() => {
        if (props.currentPatientData) {
            getEvents();
        }      
    }, [props.currentPatientData])

    useEffect(()=>{
        if (currentEvent){
            handleShowApointmentModal();
        }            
    }, [currentEvent])   
    
    
    
    return (
        <>
            {loading && <LoadingModal />}  
            <NewAppointmentModal 
                currentPatientData={props.currentPatientData}
                show={showNewAppointmentModal} 
                toggleModal={toggleNewAppointmentModal} 
                getEvents={getEvents}                                       
            />

            <AppointmentModal                
                currentEvent={currentEvent}
                show={showAppointmentModal}
                hideAppointmentModal={hideAppointmentModal}                
                getEvents={getEvents}                     
            />

            <div className='mx-auto my-3 component-big'>
                <h2 className='text-center mt-4 mb-4'>Appointments</h2>
                <div className='buttons-container flex-nowrap'>
                    <Form className='mx-2'>
                        <Form.Check 
                            defaultValue={showOnlyUsers}
                            type="switch"
                            id="custom-switch"
                            label="Filter Appointments"
                            onChange={(e)=>{setShowOnlyUsers(e.target.checked)}}
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
                </div>
                
                <Form className='my-4' onSubmit={e => {e.preventDefault()}}>
                    <div className="d-flex">                      
                            <Form.Control 
                            className="col"
                            type="search" 
                            placeholder="Search by title..." 
                            onChange={(e) => {    
                                setSearchQuery(e.target.value);                                            
                            }}/>
                            
                            <Button  className="custom-new-button" variant="secondary" onClick={toggleNewAppointmentModal}>
                                New Appointment
                            </Button>       
                    </div>               
                </Form>   
                                 
                <div className='table-container mb-5'>                
                    <Table>
                        <thead>                            
                            <tr>
                            <th>Title</th>                            
                            <th>Date</th>
                            <th>Duration</th>  
                            <th>Therapist</th>                    
                            </tr>
                        </thead>

                        <tbody className='cursor-pointer'>                        
                        {filteredEventsList && filteredEventsList.length ? filteredEventsList.map((event, index) => {
                            return (
                                <tr key={index}  className={isEventPast(event.end) ? 'event-past' : 'event-future'} onClick={() => {setCurrentEvent(event)}}>
                                <td>{event.title}</td>                             
                                <td>{moment(event.start).format("DD-MM-YYYY HH:mm")}</td>
                                <td>{getDuration(event.start, event.end) + ' min'}</td>
                                <td>{appData.orgUsers && getUserName(event.user_id)}</td>
                                </tr>
                                )
                            }):                     
                                <tr>
                                    <td colSpan={4}>
                                        No Appointments
                                    </td>                               
                                </tr>
                        }   
                        </tbody>
                    </Table>     
                </div>
            </div>
        </>
       );
};


export default AppointmentsList;
