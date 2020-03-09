import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import UserList from './UserList';

function Following() {
    const location = useLocation();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname + location.search);
            if(!res.data.error){
                setFollowing(res.data.users);
            }  
        };
        fetchData();
    }, [location]);
    return (
        <div>
            <h1>Following</h1>
            <UserList list={following}/>
        </div>
    );
}

export default Following;