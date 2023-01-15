import React from "react";
import Joi from 'joi-browser';
import Form from "./common/form";
import auth from '../Services/authService';
import {toast} from "react-toastify";
import {Navigate} from "react-router-dom";
import * as userService from '../Services/userService'

class LoginForm extends Form {
    state = {
        account: {email: '', password: ''},
        errors: {},
        status: true,
        isLoaded: true
    };

    loginSchema = Joi.object({
        email: Joi.string().required().label('Email').email(),
        password: Joi.string().required().label('Password'),
    });

    registerSchema = Joi.object({
        email: Joi.string().required().label('Email').email(),
        password: Joi.string().required().label('Password'),
        name: Joi.string().required().min(5).label('Name'),
    });

    doSubmit = async (status) => {
        try {
            this.setState({isLoaded: false});

            if (status) {
                const {account} = this.state;
                await auth.login(account.email, account.password);
            } else {
                const response = await userService.register(this.state.account);
                auth.loginByJwt(response.headers['x-auth-token'])
            }

            this.setState({isLoaded: true});
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...this.state.errors};
                errors.email = ex.response.data;
                this.setState({errors});
                toast.error(errors.email);
                this.setState({isLoaded: true});
            }
        }

    };

    render() {
        if (auth.getCurrentUser()) return <Navigate to={"/"}/>;
        const isLoaded = this.state.isLoaded;

        return (
            <div>
                {isLoaded ? (<form onSubmit={this.handleSubmit}>
                    {this.renderCardSection(true, "Log In", false)}
                </form>) : (<div className="d-flex justify-content-center">
                    <div className="spinner-border text-warning"
                         style={{top: "50%", left: "50%", position: "fixed", width: "4rem", height: "4rem"}}
                         role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>)}
            </div>

        );
    };
}

export default LoginForm;