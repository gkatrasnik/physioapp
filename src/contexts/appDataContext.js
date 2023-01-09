import {supabase} from "../supabase";
import {useState, useEffect, useContext, createContext} from "react";
import { useAuth} from "./auth"
import moment from "moment";
 

const appDataContext = createContext();

export const AppDataProvider = ({children}) => {
    const auth = useProvideAppData();
    return <appDataContext.Provider value={auth}>{children}</appDataContext.Provider>
}

export const useAppData = () => {
    return useContext(appDataContext);
}

function useProvideAppData() {
    const auth = useAuth();

    const [orgData, setOrgData] = useState(null);
    const [orgUsers, setOrgUsers] = useState([]);
    const [bodyParts, setBodyparts] = useState([]);
    const [orgPatients, setOrgPatients] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    

    //therapsis data
    const getOrgUsers = async () => {  
        const queryData = await supabase
            .from('users')
            .select()
            .eq("rec_deleted", false)
            .eq("active", true)
        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            setOrgUsers(queryData.data);     
        }                
    }

    // get bodyparts data
    const getBodyparts = async() => {
        const queryData = await supabase
            .from('bodyparts')
            .select()    
            .eq('rec_deleted', false)     
        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            const arr = queryData.data.map((bodypart) => {
                bodypart.label = bodypart.body_side ? bodypart.body_side + " " + bodypart.name : bodypart.name
                return bodypart
            })
            setBodyparts(arr);
        }     
    }

    //organization data
    const getOrgData = async (org_id) => {
        const queryData = await supabase
            .from('organizations')
            .select()
            .eq("id", org_id)
            .eq("rec_deleted", false)
        if (queryData.error) {
            alert(queryData.error.message)
        } else {
            setOrgData(queryData.data[0]);
            console.log("INITIAL PATIENTS LOAD")
        }
        
    }

    //patients data
    const getOrgPatients = async () => {     
        const queryData = await supabase
            .from('patients')
            .select()            
            .eq("rec_deleted", false)
        
        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            queryData.data.forEach(patient => patient.birthdate ? patient.birthdate = moment(patient.birthdate).toDate() : null)
            setOrgPatients(queryData.data); 
        }
                      
    }
  
    //load all data
    const loadAppData = async(org_id) => {
        setLoadingData(true);
        await Promise.allSettled([getOrgData(org_id), getOrgUsers(),getOrgPatients(), getBodyparts()]);
        setLoadingData(false);
    }


/*
    //helpers
    const updatePatientInState = (changedPatient) => {        
        let newPatientsState = orgPatients.map(patient => {
            if (patient.id === changedPatient.id) {
                return changedPatient
            }
            return patient
        })
    
        setOrgPatients(newPatientsState);
    }

    
    NOT WORKING, GETTING EMPTY ORGPATIENTS
    //handling db changes
    const handlePatientsChange = (change) => {

        // patient insert
        if (change.eventType === "INSERT") {       
            console.log("ADDED: ", ...orgPatients)  
            setOrgPatients(orgPatients => [...orgPatients, change.new])
        }  

        // patient update
        if (change.eventType === "UPDATE" && change.new.rec_deleted === false) {
            console.log("UPDATED ", ...orgPatients)
            updatePatientInState(change.new)
        } 

        // patient delete
        if (change.eventType === "UPDATE" && change.new.rec_deleted === true) {
            console.log("DELETED ", ...orgPatients)
            setOrgPatients(...orgPatients.filter(patient => patient.id !== change.new.id))
            
        }
    }
    

    //subscribe to appointments and patients changes
    useEffect(() => {
        if (auth.user) {
            const channel = supabase
            .channel('db-changes')
            .on(
                'postgres_changes',
                {
                event: '*',
                schema: 'public',
                table: 'patients',
                },
                (payload) => {
                   handlePatientsChange(payload);
                }
            )            
            .subscribe()
            console.log("subscribed to db changes")          
            
            
            return () => {
                console.log("unsubscribed from db changes")
                supabase.removeAllChannels()
            }
        }     
    
     
    }, [auth.user])    
*/
    

    return {
        orgData,
        orgUsers,
        bodyParts,      
        orgPatients, 
        loadingData,
        getOrgData,
        getOrgUsers,
        getBodyparts,
        getOrgPatients,
        loadAppData
    }

}