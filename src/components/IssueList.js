import React, { useState, useEffect } from 'react';
import {  Button, Table, Form} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import NewIssueModal from './modals/NewIssueModal';
import { CheckSquare } from 'react-bootstrap-icons';
import moment from 'moment'
import { Check2Square, Square } from 'react-bootstrap-icons';


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
            if (searchQuery.length === 0) { //show all issues 
                setFilteredIssuesData(props.issuesData);
            } else if (searchQuery.length) {//auto filter issues when typing in search      
            const newArr = props.issuesData.filter(
                issue => issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || issue.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
                setFilteredIssuesData(newArr);
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
                <h2 className='text-center mt-4 mb-4'>Issues</h2>
                <Form>
                    <Form.Check 
                        checked={props.filterIssues}
                        type="switch"
                        id="custom-switch"
                        label="Show only not resolved issues"
                        onChange={props.toggleFilterIssues}
                        className="custom-filter-switch"
                    />
                </Form>
                

                <Form  className='my-4' onSubmit={e => {e.preventDefault()}}>
                    <div className="d-flex">                      
                            <Form.Control 
                            className="col"
                            type="search" 
                            placeholder="Search by name or diagnosis..." 
                            onChange={(e) => {    
                                setSearchQuery(e.target.value);                                            
                            }}/>
                            
                            <Button   variant="secondary" onClick={toggleShowNewIssue} className="custom-new-button">
                                New Issue
                            </Button>     
                    </div>               
                </Form>   
                
                    
                
                <div className='table-container mx-n2'>                
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
                        
                        <tbody className='cursor-pointer'>                                                        
                        {filteredIssuesData && filteredIssuesData.length ? filteredIssuesData.map((issue, index) => {
                            return (
                                <tr key={index} onClick={()=>{toIssueView(issue)}} className={issue.end ?'table-success' : 'table-warning'}>
                                <td>{issue.id}</td>
                                <td>{issue.name}</td>
                                <td>{issue.start ? moment(issue.start).toDate().toLocaleDateString("sl") : ""}</td>
                                <td>{issue.end ? moment(issue.end).toDate().toLocaleDateString("sl") : ""}</td>
                                <td>{issue.diagnosis}</td>
                                <td className='text-center issue-check-icon'>{issue.end ? <Check2Square size={18} className="custom-color-success"/> : <Square size={18} className="custom-color-warning"/>}</td>
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
  

