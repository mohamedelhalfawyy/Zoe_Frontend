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
        status: true
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
            if (status){
                const {account} = this.state;
                await auth.login(account.email, account.password);
            }else {
                const response = await userService.register(this.state.account);
                auth.loginByJwt(response.headers['x-auth-token'])
            }
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...this.state.errors};
                errors.email = ex.response.data;
                this.setState({errors});
                toast.error(errors.email);
            }
        }

    };

    render() {
        if (auth.getCurrentUser()) return <Navigate to={"/"}/>;

        return (
            <form onSubmit={this.handleSubmit}>
                {this.renderCardSection(true, "Log In",false)}
            </form>
        );
    };
}

export default LoginForm;