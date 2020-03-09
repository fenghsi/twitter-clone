import React from 'react';
import { Link } from "react-router-dom";

function Navbar (props){
    return (
        <nav className="navbar navbar-light bg-light justify-content-between">
            <Link className="navbar-brand" to="/">Twitter</Link>
           
           <div>
            <Link className="btn btn-outline-success my-2 my-sm-0" to="/search">Search</Link>
                    
            {props.user &&
                <React.Fragment>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/additem">Add Item</Link>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to={"/user/"+props.user}>Profile</Link>
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={props.handleLogout}>Log out</button>
                </React.Fragment>
            }
            {!props.user &&
                <React.Fragment>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/signin">Sign in</Link>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/adduser">Sign up</Link>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/verify">Verify</Link>
                </React.Fragment>
            }
            </div>
        </nav>
    );
}

export default Navbar;