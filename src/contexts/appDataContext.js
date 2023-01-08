import {supabase} from "../supabase";
import {useState, useEffect, useContext, createContext} from "react";
import { useAuth} from "./auth"

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

    const [orgPatients, setOrgPatients] = useState([]) //-- implement later....first users and bodyparts

    

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


    //subscribe to appointments and patients changes

    useEffect(() => {
        if (auth.userObj) {
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
                   console.log(payload) 
                }
            )
            .on('postgres_changes',
                {
                event: '*',
                schema: 'public',
                table: 'appointments',
                },
                (payload) => {
                    console.log(payload)
                }
            )
            .subscribe()
            console.log("subscribed to changes")
            
            return () => {
                channel.unsubscribe();
                console.log("UNsubscribed to changes")
            }
        }     
    
     
    }, [auth.userObj])
    

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