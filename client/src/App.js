import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from "react-router-dom";
import axios from 'axios';
import Navbar from './component/layout/Navbar';
import LoginForm from './component/user/LoginForm';
import SignUpForm from './component/user/SignUpForm';
import Verify from './component/user/Verify';
import Home from './component/twitter/Home';
import AddItem from './component/twitter/AddItem';
import SearchResult from './component/search/SearchResult';
import Search from'./component/search/Search';
import ItemById from'./component/twitter/ItemById';
import Media from'./component/twitter/Media';
import Following from'./component/user/Following';
import Followers from'./component/user/Followers';
import Posts from'./component/user/Posts';
import UserProfile from './component/user/UserProfile';

function App(props) {
    let history = useHistory();
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/user');
            setUser(res.data.username);
        };
        fetchData();
    }, []);

    async function handleLogin(event) {
        event.preventDefault();
        const res = await axios.post('/login', { 
                username: event.target.username.value,
                password: event.target.password.value   
        });
        setUser(res.data.username);
        setErrorMessage(res.data.error);
        if(!res.data.error)
            history.push('/');
    }

    async function handleLogout(event) {
        await axios.post('/logout');
        setUser(null);
        history.push('/');
    }

    async function handleSearch(event) {
        event.preventDefault();
        let unixTime;
        if(event.target.dateField.value.length !== 0){
            unixTime = parseInt((new Date(event.target.dateField.value).getTime() / 1000).toFixed(0))+86399; //adding an extra day when passing the input from datepicker.
        }
        //At this point. If the request is sent from the front end, it will go through the checks above. 
        //If no time provided, leave it blank, if provided, use datepicker.value + one day to include today in the search result. 
        const res = await axios.post('/search', { 
            timestamp: unixTime,
            limit: parseInt(event.target.limitField.value),
            q: event.target.searchByString.value,
            username:event.target.searchByUsername.value,
            following: event.target.followingCheck.checked,
            rank: event.target.rank.value,
            parent: event.target.parent.value,
            replies: event.target.isReply.checked,
            hasMedia: event.target.hasMedia.checked,
        });
        if(!res.data.error){
            setSearchResult(res.data.items);
            history.push('/searchresult');
        }
    }

    return (
        <div>
            <Navbar user = {user} handleLogout={handleLogout}/>
            <div className="container">
                <Switch>
                    <Route exact path="/" render={() => (<Home/>)} />
                    <Route exact path = "/search" render={() => (<Search handleSearch= {handleSearch} />)} />
                    <Route exact path="/searchresult" render={() => (<SearchResult searchResult={searchResult} />)} />
                    <Route exact path="/item/:id" render={() => (<ItemById />)} />
                    <Route exact path="/media/:id" render={() => (<Media />)} />
                    <Route exact path="/user/:username" render={() => (<UserProfile user={user}/>)} />
                    <Route exact path="/user/:username/following" render={() => (<Following />)} />
                    <Route exact path="/user/:username/followers" render={() => (<Followers />)} />
                    <Route exact path="/user/:username/posts" render={() => (<Posts />)} />
                    {!user && 
                        <React.Fragment>
                            <Route path="/verify" render={() => (<Verify />)} />
                            <Route path="/adduser" render={() => (<SignUpForm />)} />
                            <Route path="/signin" render={() => (<LoginForm handleLogin={handleLogin} errorMessage={errorMessage}/>)}/> 
                        </React.Fragment>
                    }
                    {user &&
                        <React.Fragment>
                            <Route path="/additem" render={() => (<AddItem />)} />
                        </React.Fragment>
                    }
                    <Route render={() => <NotFound message={"Not avaialbe or you have to log " + (user ? "out" : "in")} />}/>
                </Switch>
            </div>
        </div>
    )
}

function NotFound(props) {
    return (
        <h1>{props.message}</h1>
    )
}

export default App;