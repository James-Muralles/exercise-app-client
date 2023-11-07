import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.username); 

    const handleTemplatesClick = ()=> {

        navigate('/createTemplate');
    }


  return (
    <div>
        <h1>Hello, {userName}!</h1>
        <Link to='/createTemplate'>Templates</Link>
      
    </div>
  )
}

export default HomePage;
