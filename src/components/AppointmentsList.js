
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Table, Form} from "react-bootstrap";
import moment from 'moment';
import { useAuth } from '../auth';
import NewAppointmentModal from './modals/NewAppointmentModal';
import AppointmentModal from './modals/AppointmentModal';
import LoadingModal from "./modals/LoadingModal"
import { Link } from 'react-router-dom';



const AppointmentsList = (props) => {
    const auth = useAuth();

    const [eventsList, setEventsList] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [patientsData, setPatientsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEventsList, setFilteredEventsList] = useState([]);

    const [loading, setLoading] = useState(false);

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

    const getUserName = (userId) => {
        const userObj = usersData.find(user => user.id === userId);
        return userObj ? userObj.name : "Unknown";
    }


    //patients data
    const getPatients = async () => {  
        setLoading(true); 
        const queryData = await supabase
            .from('patients')
            .select()
            .eq("rec_deleted", false)
        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            setPatientsData(queryData.data);     
        }
                  
    }

    const handleSearch = () => {   
        if (eventsList.length) {
            if (searchQuery.length === 0) { //show all events 
                setFilteredEventsList(eventsList);
            } else if (searchQuery.length) {//auto filter events when typing in search      
            const newArr = eventsList.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredEventsList(newArr);
            }
        }
    }

    useEffect(() => { //on search query change, handle search
        handleSearch(searchQuery);
    }, [eventsList, searchQuery])

    useEffect(() => {
      getEvents();
      getPatients();
      getUsers();
    }, [props])

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
                patientsData={patientsData}
                usersData={usersData}
                show={showNewAppointmentModal} 
                toggleModal={toggleNewAppointmentModal} 
                getEvents={getEvents}                                       
            />

            <AppointmentModal                
                currentEvent={currentEvent}
                patientsData={patientsData}
                usersData={usersData}  
                show={showAppointmentModal}
                hideAppointmentModal={hideAppointmentModal}                
                getEvents={getEvents}                     
            />

            <div className='mx-auto my-3 component-big'>
                <h2 className='text-center'>Appointments</h2>
                    <Form className='my-4' onSubmit={e => {e.preventDefault()}}>
                        <div className="d-flex">                      
                                <Form.Control 
                                className="col"
                                type="search" 
                                placeholder="Search by appointment title..." 
                                onChange={(e) => {    
                                    setSearchQuery(e.target.value);                                            
                                }}/>
                                
                                <Button  className="custom-new-button" variant="primary" onClick={toggleNewAppointmentModal}>
                                    New Appointment
                                </Button>       
                        </div>               
                    </Form>   
                                 
                <div className='table-container mb-5'>                
                    <Table>
                        <thead>                            
                            <tr>
                            <th>Id</th>
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
                                <td>{event.id}</td>
                                <td>{event.title}</td>                             
                                <td>{moment(event.start).format("DD-MM-YYYY HH:mm")}</td>
                                <td>{getDuration(event.start, event.end) + ' min'}</td>
                                <td>{usersData && getUserName(event.user_id)}</td>
                                </tr>
                                )
                            }):                     
                                <tr>
                                    <td colSpan={5}>
                                        No results
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
