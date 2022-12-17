// Confirm modal - reuse for all confirmation dialogues
//take callback function as parameter, onConfirm, callback.call

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmDeleteModal(props) {

  const callbackAndHide = () => {
    props.callback(props.callbackArgs);
    props.cancelCallback();
  }

  return (
    <>    
      <Modal
        show={props.show}
        onHide={props.cancelCallback}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <div className='buttons-container'>            
            <Button className="mx-2" variant="danger" onClick={callbackAndHide}>
              Delete
            </Button>
            <Button className="mx-2" variant="secondary" onClick={props.cancelCallback}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmDeleteModal;