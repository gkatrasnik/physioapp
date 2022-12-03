
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import moment from 'moment';
import { useAuth } from '../auth';


const AppointmentsList = (props) => {
    const auth = useAuth();

    const [eventsList, setEventsList] = useState([]);

    const getEvents = async () => {
        const queryData = await supabase
            .from('appointments')
            .select()
            .eq("patient_id", props.patientData.id)
            .order('end', { ascending: false })
        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            queryData.data.forEach(event => {
                event.start = new Date(event.start);
                event.end = new Date(event.end);
            });
            setEventsList(queryData.data);
        }     
    }

    const isEventPast = (eventEnd) => {
        const now = new Date();
        return eventEnd < now;
    }

    const getDuration = (start, end) => {
        let momentStart = moment(start);
        let momentEnd = moment(end);
        var duration = moment.duration(momentEnd.diff(momentStart));
        return Math.floor(duration.asMinutes());       
    }

    useEffect(() => {
      getEvents();
    }, [props])
    
    
    
    return (
        <>
            <h2 className='text-center'>Appointments</h2>
            <div className='table-container mb-5'>                
                <Table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Patient</th>                            
                        <th>Date</th>
                        <th>Duration</th>  
                        <th>Title</th>                          
                        </tr>
                    </thead>
                    <tbody>
                        
                    {eventsList && eventsList.length ? eventsList.map((event, index) => {
                        return (
                            <tr key={index}  className={isEventPast(event.end) ? 'appointment-past' : 'appointment-future'}>
                            <td>{event.id}</td>
                            <td>{props.patientData.name}</td>                                
                            <td>{new Date(event.start).toLocaleDateString("sl")}</td>
                            <td>{getDuration(event.start, event.end) + ' min'}</td>
                            <td>{event.title}</td>
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
        </>
       );
};


export default AppointmentsList;
