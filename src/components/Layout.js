import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { ChevronLeft, House, People, CalendarWeek, ThreeDots   } from "react-bootstrap-icons";

function Layout({children}) {
    const auth = useAuth();
    const navigate = useNavigate();
    let location = useLocation();

    const [showBackBtn, setShowBackBtn] = useState(false);
    const [currentLoc, setCurrentLoc] = useState(null);

    const goHome = () => {
      navigate("/");
    }

    const goBack = () => {
      navigate(-1);
    }

    const handleShowBackBtn = () => { 
      const urls = ["/profile", "/issue"]
      let currentUrl = window.location.href;    
    
      if (urls.some(url => currentUrl.includes(url))) {
        setShowBackBtn(true)
      }  else {
        setShowBackBtn(false)
      }             
    }

    useEffect(() => {
      handleShowBackBtn();
    }, [])

    //monitor current location and color nav btn
    useEffect(() => {
      setCurrentLoc(location.pathname)
    }, [location]);    

  return (
    <>
        <Navbar key={false} bg="primary" variant="dark" expand={false} fixed="top" className='custom-box-shadow custom-navbar'>
          <Container fluid >
            
              {showBackBtn ? <ChevronLeft onClick={goBack} className="cursor-pointer mx-2" size={24} color="white"/>:<div style={{width:"40px"}}></div>}
              <Navbar.Brand onClick={goHome} className="cursor-pointer mx-4 navbar-brand-logo lobster-font">PhysioApp</Navbar.Brand>
              <div style={{width:"40px"}}></div>
          
              
              <nav className="custom-navigation-nav">
                <Link to={"/"} className={"custom-navigation-item" + (currentLoc === "/" ? " active-url": "")}><House/><p>Home</p></Link>
                <Link to={"/patients"} className={"custom-navigation-item" + ((["/patients", "/profile", "/issue"]).includes(currentLoc) ? " active-url": "")}><People/><p>Patients</p></Link>
                <Link to={"/appointments"} className={"custom-navigation-item"+ (currentLoc === "/appointments" ? " active-url": "")}><CalendarWeek/><p>Appointments</p></Link>
                <Link to={"/options"} className={"custom-navigation-item" + (currentLoc === "/options" ? " active-url": "")}><ThreeDots/><p>More</p></Link>                  
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