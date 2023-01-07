import {supabase} from "../supabase";
import {useState, useContext, createContext} from "react";

const appDataContext = createContext();

export const AppDataProvider = ({children}) => {
    const auth = useProvideAppData();
    return <appDataContext.Provider value={auth}>{children}</appDataContext.Provider>
}

export const useAppData = () => {
    return useContext(appDataContext);
}

function useProvideAppData() {
    const [orgData, setOrgData] = useState(null);
    const [orgUsers, setOrgUsers] = useState([]);
    const [bodyParts, setBodyparts] = useState([]);

    //const [orgPatients, setOrgPatients] = useState([]) -- implement later....first users and bodyparts

    

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
        }
        
    }
  
    const loadAppData = async(org_id) => {
        await getOrgData(org_id);
        await getOrgUsers();
        await getBodyparts();
    }

    return {
        orgData,
        orgUsers,
        bodyParts,       
        getOrgData,
        getOrgUsers,
        getBodyparts,
        loadAppData
    }

}