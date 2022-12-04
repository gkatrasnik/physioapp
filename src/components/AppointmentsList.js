
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
            .eq("rec_deleted", false)
            .order('end', { ascending: false })
        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            queryData.data.forEach(event => {
                event.start = moment(event.start).toDate();
                event.end = moment(event.end).toDate();
            });
            setEventsList(queryData.data);
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
                        <th>Title</th>                            
                        <th>Date</th>
                        <th>Duration</th>  
                        <th>Patient</th>                    
                        </tr>
                    </thead>
                    <tbody>
                        
                    {eventsList && eventsList.length ? eventsList.map((event, index) => {
                        return (
                            <tr key={index}  className={isEventPast(event.end) ? 'appointment-past' : 'appointment-future'}>
                            <td>{event.id}</td>
                            <td>{event.title}</td>                             
                            <td>{moment(event.start).toDate().toLocaleDateString("sl")}</td>
                            <td>{getDuration(event.start, event.end) + ' min'}</td>
                            <td>{props.patientData.name}</td>
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
