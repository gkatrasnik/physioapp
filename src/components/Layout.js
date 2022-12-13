import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

function Layout({children}) {
    const auth = useAuth();

  return (
    <>
        <Navbar key={false} bg="light" expand={false}>
          <Container fluid>
            <Navbar.Brand href="#">PhysioApp</Navbar.Brand>
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
        <div>
           {children} 
        </div>      
    </>
  ); 
}

export default Layout;