import React, { useState, useEffect } from 'react';
import {  Button, Table} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import NewIssueModal from './modals/NewIssueModal';
import { CheckSquare } from 'react-bootstrap-icons';
import moment from 'moment'

const IssueList = (props) => {
    const navigate = useNavigate();

    // issue data state
    const [showNewIssue, setShowNewIssue] = useState(false);

    const toIssueView=(issue)=>{
     navigate('/issue',{state:{issueData:issue}});
    }

    const toggleShowNewIssue = () => {
        setShowNewIssue(!showNewIssue);
    }
    

    return (
        <>

            <NewIssueModal patientData={props.patientData} showNewIssue={showNewIssue} getIssuesData={props.getIssuesData} toggleShowNewIssue={toggleShowNewIssue}/>

            <h2 className='text-center'>issues</h2>
            <Button  className="m-2" variant="primary" type="submit" onClick={toggleShowNewIssue}>
                New Issue
            </Button>

                <div className='table-container mb-5'>                
                    <Table>
                        <thead>
                            <tr>
                            <th>Id</th>
                            <th>Issue</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Diagnosis</th>
                            <th className='text-center'>Resolved</th>
                            </tr>
                        </thead>
                        
                        <tbody className='hand'>                                                        
                        {props.issuesData && props.issuesData.length ? props.issuesData.map((issue, index) => {
                            return (
                                <tr key={index} onClick={()=>{toIssueView(issue)}} className={issue.end ?'text-white bg-success' : 'bg-warning'}>
                                <td>{issue.id}</td>
                                <td>{issue.name}</td>
                                <td>{issue.start ? moment(issue.start).toDate().toLocaleDateString("sl") : ""}</td>
                                <td>{issue.end ? moment(issue.end).toDate().toLocaleDateString("sl") : ""}</td>
                                <td>{issue.diagnosis}</td>
                                <td className='text-center'>{issue.end ? <CheckSquare/> : ""}</td>
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


export default IssueList;
  
