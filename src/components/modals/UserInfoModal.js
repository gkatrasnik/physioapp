import React, {useState, useEffect} from 'react';
import { supabase } from '../../supabase';
import {useAuth} from "../../contexts/auth";
import { Form, Button, Modal } from "react-bootstrap";
import LoadingModal from "./LoadingModal";


const UserInfoModal = (props) => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);


    const [name, setName ]= useState(auth.user.user_metadata.name);
    const [phone, setPhone ]= useState(auth.user.user_metadata.phone);
    const [address, setAddress ]= useState(auth.user.user_metadata.address);
    const [city, setCity ]= useState(auth.user.user_metadata.city);
    const [zipCode, setZipCode ]= useState(auth.user.user_metadata.zip_code);

    const [orgCode, setOrgCode] = useState(auth.user.user_metadata.org_id);

    const toggleEditing = () => {
        setEditing(!editing)
    }

    const handleClose = () => {
        props.hideModal();
        setEditing(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {           
          name: name,
          address: address,
          phone: phone,
          city:city,
          zip_code:zipCode,
          org_id:orgCode
        }        

        //update auth.users
        const updateUserData = await auth.updateUserMetadata(data);

        //also update public.users
        const queryData = await supabase
        .from('users')
        .update({               
            name: name,
            address: address,
            phone: phone,
            city:city,
            zip_code:zipCode,                
        })
        .eq('id', auth.user.id)


        //if errors 
        if (updateUserData.error) {
            setLoading(false);
            alert(updateUserData.error.message)
            console.log(updateUserData.error)
        } else if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
            console.log(queryData.error)
        } else {
            setLoading(false);
            handleClose();
        }

    }
   
    return (
    <>
      {loading && <LoadingModal />}

      <Modal centered backdrop="static" show={props.show} onHide={handleClose}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>My Info</Modal.Title>
            </Modal.Header>
                <Modal.Body className="py-2">
                <Form
                    
                    style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
                >

                    <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        disabled={!editing}
                        defaultValue={name}
                        type="text"
                        onChange={(e) => {
                        setName(e.target.value);
                        }}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        required
                        disabled={!editing}
                        defaultValue={phone}
                        type="tel"
                        onChange={(e) => {
                        setPhone(e.target.value);
                        }}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        required
                        disabled={!editing}
                        defaultValue={address}
                        type="text"
                        onChange={(e) => {
                        setAddress(e.target.value);
                        }}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        required
                        disabled={!editing}
                        defaultValue={city}
                        type="text"
                        onChange={(e) => {
                        setCity(e.target.value);
                        }}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="zip">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                        required
                        disabled={!editing}
                        defaultValue={zipCode}
                        type="number"
                        onChange={(e) => {
                        setZipCode(e.target.value);
                        }}
                    />
                    </Form.Group>

                    <div className='buttons-container'>                    
                            {editing ?                                                         
                                <Button  className="m-2" variant="secondary" onClick={handleSubmit}>
                                    Save
                                </Button>                             
                                :                
                                <Button className="m-2 " variant="outline-secondary" onClick={toggleEditing}>
                                    Edit
                                </Button>
                            }
                            <Button className="ms-2 my-2" variant="outline-secondary" onClick={handleClose}>
                                {!editing ? "Close" : "Cancel"}
                            </Button>
                        </div>
                </Form>          
                </Modal.Body>
        </Modal>
    </>
  );
};

export default UserInfoModal;