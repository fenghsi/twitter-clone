import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Item from './Item';

function ItemById() {
    const location = useLocation();
    const [item, setItem] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname);
            if(!res.data.error){
                setItem(res.data.item);
            }
        };
        fetchData();
    }, [location]);

    return (
        <div>
            <h1>Tweet</h1>
            { item &&
                <Item item={item}/>
            }
        </div>
    );
}

export default ItemById;