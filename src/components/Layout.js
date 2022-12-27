import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { ChevronLeft, House, Search, CalendarWeek, BoxArrowLeft   } from "react-bootstrap-icons";

function Layout({children}) {
    const auth = useAuth();
    const navigate = useNavigate();
    const [showBackBtn, setShowBackBtn] = useState(false);

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
    

  return (
    <>
        <Navbar key={false} bg="primary" variant="dark" expand={false} fixed="top" className='custom-box-shadow'>
          <Container fluid >
            
              {showBackBtn ? <ChevronLeft onClick={goBack} className="cursor-pointer mx-2" size={24} color="white"/>:<div style={{width:"40px"}}></div>}
              <Navbar.Brand onClick={goHome} className="cursor-pointer mx-4 navbar-brand-logo lobster-font">PhysioApp</Navbar.Brand>
              <div style={{width:"40px"}}></div>
          
              
              <nav className="custom-navigation-nav">
                <Link to={"/"} className="custom-navigation-item"><House/><p>Home</p></Link>
                <Link to={"/patients"} className="custom-navigation-item"><Search/><p>Patients</p></Link>
                <Link to={"/appointments"} className="custom-navigation-item"><CalendarWeek/><p>Appointments</p></Link>
                <Link onClick={auth.logout} className="custom-navigation-item"><BoxArrowLeft/><p>Logout</p></Link>                  
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