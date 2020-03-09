import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List } from 'antd';
import { useLocation, Link } from "react-router-dom";

function Posts() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname + location.search);
            if(!res.data.error){
                setPosts(res.data.items);
            }  
        };
        fetchData();
    }, [location]);
    return (
        <div>
            <h1>Posts</h1>
            <List
                itemLayout="horizontal"
                dataSource={posts}
                renderItem={post => (
                <List.Item>
                    <Link to={"/item/"+post}>{post}</Link>
                </List.Item>
                )}
            />
        </div>
    );
}

export default Posts;