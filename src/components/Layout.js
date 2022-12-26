import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { ChevronLeft, House, Search, CalendarWeek, BoxArrowLeft   } from "react-bootstrap-icons";

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
        <Navbar key={false} bg="primary" variant="dark" expand={false} fixed="top" className='navbar-shadow'>
          <Container fluid >
            <div className='d-flex align-items-center'>
              <ChevronLeft onClick={goBack} className="cursor-pointer mx-2" size={24} color="white"/>
              <Navbar.Brand onClick={goHome} className="cursor-pointer mx-4">PhysioApp</Navbar.Brand>
            </div>
          
              
                <nav className="custom-navigation-nav">
                  <Link to={"/"} className="custom-navigation-item"><House/>Home</Link>
                  <Link to={"/patients"} className="custom-navigation-item"><Search/>Patients</Link>
                  <Link to={"/appointments"} className="custom-navigation-item"><CalendarWeek/>Appointments</Link>
                  <Link onClick={auth.logout} className="custom-navigation-item"><BoxArrowLeft/>Logout</Link>                  
                </nav>            
            
          </Container>
        </Navbar>
        <div className='main-container'>
           {children} 
        </div>      
    </>
  ); 
}

export default Layout;