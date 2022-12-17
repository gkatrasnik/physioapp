// shows issues/symptoms? on body picture
// bodyparts table linked to picture body parts
// symptom intensity - red - 10, white - 0 

import { useRef, useEffect, useState } from "react";
import humanbody from '../assets/humanbody.png';

const BodyPicture = (props) => {
    const bodyImage = useRef();
    const [symptomDivs, setSymptomDivs] = useState([]);

    const createSymptomDivs = () => {
        let tempSymptomDivs = [];
        let l = bodyImage.current.offsetLeft;
        let t = bodyImage.current.offsetTop;
        let w = bodyImage.current.width;
        let h = bodyImage.current.height;

        props.symptomsData.map(symptom => {
            let symptomObj = {};
            let symptomCoordinates = getSymptomCoordinates(symptom,l,t,w,h);
            if (symptomCoordinates.hasCoordinates) {
                symptomObj.x = symptomCoordinates.x - 10; // -10 = half of div with
                symptomObj.y = symptomCoordinates.y - 10 ; // -10 = half of div height
                symptomObj.intensity = symptom.intensity;
                symptomObj.createdAt = symptom.created_at;
                symptomObj.id = symptom.id
                tempSymptomDivs.push(symptomObj)
            }                      
        })
        setSymptomDivs(tempSymptomDivs);
    }

    const getSymptomCoordinates = (symptom, pictureLeft, pictureTop, pictureWidth, pictureHeight) => {
        let newCoordinates = {};
        newCoordinates.x = symptom.bodypart_id ? (pictureLeft + (pictureWidth * getBodypartCoordinates(symptom.bodypart_id)[0] / 100)) : null;
        newCoordinates.y = symptom.bodypart_id ? (pictureTop + (pictureHeight * getBodypartCoordinates(symptom.bodypart_id)[1] / 100)) : null;
        newCoordinates.hasCoordinates = !!symptom.bodypart_id; //false if there is no bodypart
        return newCoordinates;
    }

     const getBodypartCoordinates = (bodypartId) => {        
        let coordinates = [0,0];
        const bodypartObj = props.bodypartsData.find(bodypart => bodypart.id === bodypartId);
        coordinates[0] = bodypartObj  ? bodypartObj.xcoordinate : null;
        coordinates[1] = bodypartObj  ? bodypartObj.ycoordinate : null;
        return coordinates
    }

    useEffect(() => {
        //render symptom divs everytime symptom is added/deleted, or "symptoms" tab is clicked
        if (props.activeTab === "Symptoms") {
            createSymptomDivs(); 
        }        
    }, [props])

    
    //find click position on image in %
    useEffect(() => {
      const handleClick = e => {
      let rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left; //x position within the element.
      let y = e.clientY - rect.top;  //y position within the element.

      let xp = Math.round(x/w*100);
      let yp =Math.round(y/h*100);

      console.log(e);
    };

    const element = bodyImage.current;
    const w = element.width;
    const h = element.height;

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
    }, [])
    

    return (
        <div className="humanbody-container">
            <img ref={bodyImage} src={humanbody} className="humanbody"/>            
            {symptomDivs.map((symptom) => {
                return <div key={symptom.id} className="symptom-div" style={{position: "absolute", left: symptom.x, top: symptom.y}}></div>
            })}                      
        </div>
    )
}

export default BodyPicture;