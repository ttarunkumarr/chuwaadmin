import React from 'react'
import { auth } from '../config';
import Navbar from '../Components/Navbar';
import './Dasboard.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const handleLogout = () => {
    auth.signOut();
  };

export default function Dashboard() {
    const history = useHistory();
    const handleUploadPage=()=>{
        history.push({
            pathname: "/Home",
           
          });
    }
    const linkgen=()=>{
        history.push({
          pathname: "/linkgen",
         
        });
      }
      const mylinks=()=>{
        history.push({
          pathname: "/mylinks",
         
        });
      }
    const buttons = [{ text: "Logout" }];
  return (
    <div className='main_cr'>
         <Navbar
        backgroundColor="#333"
        textColor="#fff"
        buttons={buttons}
        onClick={handleLogout}
      />
      <div className='main_head'>
        <h1>Welcome To Dashboard</h1>
      </div>
     <div className='mainCardsContainer'>
        <div className='card' onClick={()=>{
            handleUploadPage()
        }}>
            <div className='cardLogo'>
            <img
            src={
           require('../assets/Rectangle21.png')
            }
          />
            </div>
            <div className='cardHead'>
                <h1>Upload Resume</h1>
            </div>
        </div>
        <div className='card' onClick={()=>{
            linkgen();
        }}>
            <div className='cardLogo'>
            <img
            src={
           require('../assets/Rectangle22.png')
            }
          />
            </div>
            <div className='cardHead'>
                <h1>Resume Inventory</h1>
            </div>
        </div>
        <div className='card' onClick={()=>{
            mylinks();
        }}>
            <div className='cardLogo'>
            <img
            src={
           require('../assets/Rectangle23.png')
            }
          />
            </div>
            <div className='cardHead'>
                <h1>My Links</h1>
            </div>
        </div>
     </div>
    </div>
  )
}
