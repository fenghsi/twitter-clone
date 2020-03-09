import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function SignUpForm() {
    let history = useHistory();

    async function handleSignUp(event){
        event.preventDefault();
        await axios.post('/adduser', {
            username: event.target.username.value,
            password: event.target.password.value,
            email: event.target.email.value,
        });
        history.push('/verify');
    }

    return (
        <div>
            <h5 className="card-title text-color-1 pb-4 font-weight-bold">Sign Up</h5>
            <form className="form-signup" onSubmit={handleSignUp}>
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
                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-3 col-form-label">Email:</label>
                    <div className="col-sm-7">
                        <input type="text" name="email" className="form-control" placeholder="Enter your email" required />
                    </div>
                </div>
                <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Register</button>
            </form>
        </div>
    );
}

export default SignUpForm;