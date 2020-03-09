import React from 'react';
import {Link} from "react-router-dom";

function LoginForm(props) {
    return ( 
            <div>
                <h1>Twitter</h1>
                <div className="col-sm-5 mx-auto card card-signin my-5 card-body text-center">
                    {props.errorMessage &&
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {props.errorMessage}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                    <h5 className="card-title text-color-1 pb-4 font-weight-bold">Sign In</h5>
                    <form className="form-signin" onSubmit={props.handleLogin}>
                        <div className="form-group row">
                            <label htmlFor="username" className="col-sm-3 col-form-label">Username:</label>
                            <div className="col-sm-7">
                                <input type="text" name="username" className="form-control" placeholder="Enter your name" required autoFocus />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="password" className="col-sm-3 col-form-label">Password:</label>
                            <div className="col-sm-7">
                                <input type="text" name="password" className="form-control" placeholder="Enter your password" required />
                            </div>
                        </div>
                        <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Login</button>
                        <Link to="/adduser">Sign Up</Link>
                        <Link to="/verify">Verify</Link>
                    </form>
                </div>
            </div>
    );
}

export default LoginForm;