

import React, {useState, useCallback, useEffect} from 'react';
import Layout from "./Layout";
import {useAuth} from "../auth";
import { Container,Button } from 'react-bootstrap';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";

const Appointments = () => {
    const auth = useAuth();
    const localizer = momentLocalizer(moment)
    const [eventList, setEventList] = useState([]);
    const [patientsData, setPatientsData] = useState([]);
    const navigate = useNavigate();

    
    // implement adding new events/appointments --- handle error in getEvents()
     const handleSelectSlot = useCallback(
        ({ start, end }) => {
        const title = window.prompt('New Event name')
        console.log("slot")
        if (title) {
            setEventList((prev) => [...prev, { start, end, title }])
        }
        },
        [setEventList]
    )

    const handleSelectEvent = (event) => {
        toPatientProfile(event.patient)
    }
        
    


  const getEvents = async () => {
         const queryData = await supabase
            .from('appointments')
            .select()
            .eq("org_id", auth.user.user_metadata.org_id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
        
            queryData.data.forEach((event) => {
            let patient = patientsData.find(patient => patient.id === event.patient_id);
                event.start = new Date(event.start)
                event.end = new Date(event.end)
                event.title = patient.name
                event.patient = patient
            })
            
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


    const toPatientProfile=(patient)=>{
     navigate('/patient',{state:{patientData:patient}});
    }

    useEffect(() => {
        getPatients(); //on patients data update also get events
    }, [])

    useEffect(() => {
        getEvents();
    }, [patientsData])
    

    return (
        <Layout>
            <Container>
                <h1 className='text-center'>Appointments</h1>   
                <Button>New</Button>
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