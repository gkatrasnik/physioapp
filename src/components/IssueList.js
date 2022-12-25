import React, { useState, useEffect } from 'react';
import {  Button, Table, Form} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import NewIssueModal from './modals/NewIssueModal';
import { CheckSquare } from 'react-bootstrap-icons';
import moment from 'moment'

const IssueList = (props) => {
    const navigate = useNavigate();

    // issue data state
    const [showNewIssue, setShowNewIssue] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredIssuesData, setFilteredIssuesData] = useState([]);

    const toIssueView=(issue)=>{
     navigate('/issue',{state:{issueData:issue}});
    }

    const toggleShowNewIssue = () => {
        setShowNewIssue(!showNewIssue);
    }

    const handleSearch = () => {   
        if (props.issuesData.length) {
            if (searchQuery.length === 0) { //show all issues 
                setFilteredIssuesData(props.issuesData);
            } else if (searchQuery.length) {//auto filter issues when typing in search      
            const newArr = props.issuesData.filter(
                issue => issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || issue.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredIssuesData(newArr);
            }
        }
    }

    useEffect(() => { //on search query change, handle search
        handleSearch(searchQuery);
    }, [props.issuesData, searchQuery])
    

    return (
        <>

            <NewIssueModal 
                patientData={props.patientData} 
                showNewIssue={showNewIssue} 
                getIssuesData={props.getIssuesData} 
                toggleShowNewIssue={toggleShowNewIssue}
            />
            <div className="my-3 mx-auto component-big">
                <h2 className='text-center'>Issues</h2>
                <div className='buttons-container'>
                    <Button  className="m-2" variant="primary" onClick={toggleShowNewIssue}>
                        New Issue
                    </Button>
                </div>
                <div className='table-container'>                
                    <Table>
                        <thead>
                            <tr>
                                <th colSpan={6}>
                                     <Form  onSubmit={e => {e.preventDefault()}}>
                                        <div className="d-flex">                      
                                                <Form.Control 
                                                className="col"
                                                type="search" 
                                                placeholder="Search by issue name or diagnosis..." 
                                                onChange={(e) => {    
                                                    setSearchQuery(e.target.value);                                            
                                                }}/>     
                                        </div>               
                                    </Form>   
                                </th>
                            </tr>
                            <tr>
                            <th>Id</th>
                            <th>Issue</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Diagnosis</th>
                            <th className='text-center'>Resolved</th>
                            </tr>
                        </thead>
                        
                        <tbody className='cursor-pointer'>                                                        
                        {filteredIssuesData && filteredIssuesData.length ? filteredIssuesData.map((issue, index) => {
                            return (
                                <tr key={index} onClick={()=>{toIssueView(issue)}} className={issue.end ?'custom-bg-light-success' : 'custom-bg-light-warning'}>
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
                                    <td colSpan={6}>
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


export default IssueList;
  

