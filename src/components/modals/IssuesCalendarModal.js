    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useCallback, useEffect} from 'react';
    import Layout from "./Layout";
    import {useAuth} from "../auth";
    import { Container,Button } from 'react-bootstrap';
    import { supabase } from '../supabase';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'

    
    const IssuesCalendarModal = () => {
        const auth = useAuth();
        const localizer = momentLocalizer(moment);        
        const [currentEvent, setCurrentEvent] = useState(null);
        const [showIssuesCalendar, setShowIssuesCalendar] = useState(false);


        //IssuesCalendar logic

        const toggleIssuesCalendar = () => {
            setShowIssuesCalendar(!showIssuesCalendar);
        }
    
        const isEventPast = (eventEnd) => {
            const now = moment().toDate();
            return eventEnd < now;
        }

        useEffect(()=>{
            if (currentEvent){
                toggleIssuesCalendar();
            }            
        }, [currentEvent])   
      
        return (
            
                <Container>
                    <h1 className='text-center'>Appointments</h1>   
                    <Button onClick={toggleIssuesCalendar}>{showIssuesCalendar ? Hide : Show}</Button>                    
                    <div className='my-5'>
                        <Calendar
                        localizer={localizer}
                        events={props.issuesData}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        onSelectEvent={()=>{setCurrentEvent(event)}}
                        
                        longPressThreshold={250} 
                        selectable
                        />
                    </div>
                </Container>                
            
    
        );
    };
    
    export default IssuesCalendarModal;