    // implement adding new events/appointments --- handle error in getEvents()      

    import React, {useState, useCallback, useEffect} from 'react';
    import { Container,Button } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import moment from 'moment'

    
    const IssuesCalendarModal = (props) => {
        const localizer = momentLocalizer(moment);        
        const [currentEvent, setCurrentEvent] = useState(null);
        const [showIssuesCalendar, setShowIssuesCalendar] = useState(false);
        const [calendarIssues, setCalendarIssues] = useState([]);

        const navigate = useNavigate();

        //IssuesCalendar logic

        const handleSelectEvent = (event) => {
            //find event in original props.issuesData by index
            let index = calendarIssues.indexOf(event);            

            //open appointment modal (event)
            setCurrentEvent(props.issuesData[index]);
        } 

        const handleShowCalendar = () => {
            setShowIssuesCalendar(true);
        }

        const handleHideCalendar = () => {
            setShowIssuesCalendar(false);
        }

        const toIssueView=(issue)=>{
            navigate('/issue',{state:{issueData:issue}});
        }

        const eventStyleGetter = (event, start, end, isSelected) => {
            let backgroundColor = event.hasEnd ? "#58ac5c" : "#e2b85c";
            let fontColor = event.hasEnd ? "white" : "black"
            let style = {
                backgroundColor: backgroundColor,
                borderRadius: '0px',
                opacity: 1,
                color: fontColor,
                border: '1px',
                display: 'block'
            };
            return {
                style: style
            };
        }

        useEffect(()=>{
            if (currentEvent){
                toIssueView(currentEvent);   
                setCurrentEvent(null);           
            }            
        }, [currentEvent])   

        useEffect(() => {
          if (props.issuesData) {
            const clonedArr = props.issuesData.map((event) => {
                const copiedEvent = Object.assign({}, event);
                copiedEvent.start = moment(copiedEvent.start).toDate();  
                if (copiedEvent.end)  {
                     copiedEvent.end = moment(copiedEvent.end).toDate();
                     copiedEvent.hasEnd = true;
                } else {
                    copiedEvent.end = moment();
                    copiedEvent.hasEnd = false;
                }   
                return copiedEvent;
            }); 
            setCalendarIssues(clonedArr);
          }
        }, [props])
        
      
        return (
            
                <Container className="mb-5">
                    {showIssuesCalendar && 
                    <h1 className='text-center'>Issues Calendar</h1>} 

                    {showIssuesCalendar ?
                    <Button onClick={handleHideCalendar}>Hide Calendar</Button> :
                    <Button onClick={handleShowCalendar}>Show Issues Calendar</Button>   
                    }

                    {showIssuesCalendar && 
                    <div className='my-5'>
                        <Calendar
                        localizer={localizer}
                        events={calendarIssues}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        titleAccessor="name"
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={(eventStyleGetter)}
                        longPressThreshold={250} 
                        selectable
                        />
                    </div>}
                </Container>                
            
    
        );
    };
    
    export default IssuesCalendarModal;