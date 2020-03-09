import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from "react-router-dom";
import { notification, List } from 'antd';
import PostItemId from './PostItemId';

function UserProfile(props) {
    const location = useLocation();
    const {username} = useParams();
    const [userprofile, setUserProfile] = useState(null);
    const [following, setFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [update, forceUpdate] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname);
            if(!res.data.error){
                setUserProfile(res.data.user);
            }
            if(props.user){
                const res1 = await axios.post("/user/following", {username: username});
                setFollowing(res1.data.following);
            }
            const res2 = await axios.get("/user/" + username + "/posts");
            if(!res2.data.error){
                setPosts(res2.data.items);
            }  
        };
        fetchData();
    }, [location, update, props.user, username]);

    async function handleFollow() {
        const res = await axios.post("/follow", {
            username: username,
            follow: !following
        });
        if(!res.error) {
            notification['success']({
                message: following?'Successfully unfollowed' : 'Successfully followed',
                duration: 0,
            });
            setFollowing(!following);
        }
        else{
            notification['error']({
                message: following ? 'Failed to unfollow' : 'Failed to follow',
                description: res.error,
                duration: 0,
            });
        }
    }

    async function handleDeleteTwitter(id){
        axios.delete('/item/' + id)
            .then(res=>{
                notification['success']({
                    message: 'Tweet successfully deleted',
                    description:
                    'Id: ' + id,
                    duration: 0,
                });
                forceUpdate(n => !n)
            })
            .catch(function(err) {
                notification['error']({
                    message: 'Failed to delete Tweet',
                    description:
                    'Id: ' + id,
                    duration: 0,
                });
            });
    }

    return (
        <div>
            { userprofile && 
                <React.Fragment>
                    <p> Username: {userprofile.username}</p>
                    <p> Email: {userprofile.email}</p>
                    <p> <Link to={"/user/"+username+"/following"}>Following: {userprofile.following}</Link></p>
                    <p> <Link to={"/user/"+username+"/followers"}>Follower: {userprofile.followers}</Link></p>
                    { (props.user && username !== props.user) &&
                        <button className="btn btn-outline-dark text-uppercase mt-4" onClick={handleFollow}>{following?"Unfollow":"Follow"}</button>
                    }
                    <h1>Posts</h1>
                    <List
                        itemLayout="horizontal"
                        dataSource={posts}
                        renderItem={post => (
                        <List.Item>
                            <PostItemId post={post} canDelete={username === props.user} handleDeleteTwitter={handleDeleteTwitter}/>
                        </List.Item>
                        )}
                    />
                </React.Fragment>
            }
        </div>
    );
}

export default UserProfile;