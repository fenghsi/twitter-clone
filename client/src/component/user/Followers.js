import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import UserList from './UserList';

function Followers() {
    const location = useLocation();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname + location.search);
            if(!res.data.error){
                setFollowers(res.data.users);
            }  
        };
        fetchData();
    }, [location]);

    return (
        <div>
            <h1>Followers</h1>
            <UserList list={followers}/>
        </div>
    );
}

export default Followers;