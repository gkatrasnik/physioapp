import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { ChevronLeft } from "react-bootstrap-icons";

function Layout({children}) {
    const auth = useAuth();
    const navigate = useNavigate();

    const goHome = () => {
      navigate("/");
    }

    const goBack = () => {
      navigate(-1);
    }

  return (
    <>
        <Navbar key={false} bg="primary" variant="dark" expand={false} fixed="top">
          <Container fluid >
            <div className='d-flex align-items-center'>
              <ChevronLeft onClick={goBack} className="cursor-pointer mx-2" size={24} color="white"/>
              <Navbar.Brand onClick={goHome} className="cursor-pointer mx-4">PhysioApp</Navbar.Brand>
            </div>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-false`}
              aria-labelledby={`offcanvasNavbarLabel-expand-false`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                  PhysioApp 
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link to={"/"} className="btn btn-secondary mb-2">Home</Link>
                  <Link to={"/patients"} className="btn btn-secondary mb-2">Patients</Link>
                  <Link to={"/appointments"} className="btn btn-secondary mb-2">Appointments</Link>
                  <Link onClick={auth.logout} className="btn btn-secondary mb-2">Logout</Link>                  
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        <div className='pt-5'>
           {children} 
        </div>      
    </>
  ); 
}

export default Layout;