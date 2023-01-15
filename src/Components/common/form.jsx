import {Component} from "react";
import passwordComplexity from 'joi-password-complexity';
import Joi from 'joi-browser';
import Input from './input';
import Select from "./select";

class Form extends Component {

    state = {
        account: {},
        errors: {},
        status: null,
    };

    validate = (isForm) => {
        let schema = {}
        if (this.state.status)
        {
            const {loginSchema} = this;
            schema = loginSchema;
        }
        else{
            const {registerSchema} = this;
            schema = registerSchema;
        }

        if (isForm) {
            const {formSchema} = this;
            schema = formSchema;
        }


        const {account} = this.state;

        const {error} = schema.validate(account, {abortEarly: false});

        const {error: passError} = passwordComplexity().validate(account.password);

        if (!passError && !error) return null;

        const errors = {};

        if (error) {
            for (let item of error.details) {
                errors[item.path[0]] = item.message;
            }
            return errors;
        } else {
            for (let item of passError.details) {
                errors['password'] = item.message.replaceAll('value', 'Password');
            }
            return errors;
        }

    };

    validateProperty = ({name, value}) => {
        const obj = {[name]: value};

        const schema = Joi.object({[name]: Joi.string().required().label(`${[name]}`)});

        const {error} = schema.validate(obj);

        return error ? error.details[0].message : null;
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate(false);
        this.setState({errors: errors || {}});
        if (errors) return;

        if (this.state.status)
            this.doSubmit(true);
        else
            this.doSubmit(false);
    };

    handleFormSubmit = e => {
        e.preventDefault();
        const errors = this.validate(true);
        this.setState({errors: errors || {}});
        if (errors) return;

        this.doSubmit();
    };

    handleChange = ({currentTarget: input}) => {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const account = {...this.state.account};
        account[input.name] = input.value;
        this.setState({account, errors});
    };

    changeStatus = () => {
        this.setState({status: !this.state.status})
    };

    renderCardSection(isLogin, frontName) {
        return (
            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                {isLogin && <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>}
                                {isLogin && <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" onClick={this.changeStatus}/>}
                                <label htmlFor="reg-log"></label>
                                <div className="card-3d-wrap mx-auto">
                                    <div className="card-3d-wrapper">
                                        {this.renderCardFront(isLogin, frontName)}
                                        {this.renderCardBack("Sign Up")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderCardFront(isLogin, label) {
        return (
            <div className="card-front">
                <div className="center-wrap">
                    <div className="section text-center">
                        <h4 className="mb-4 pb-3">{label}</h4>
                        {isLogin && this.renderInput(
                            "email",
                            "Your Email",
                            "form-group",
                            "input-icon uil uil-at",
                            "email"
                        )}
                        {isLogin && this.renderInput(
                            "password",
                            "Your Password",
                            "form-group mt-2",
                            "input-icon uil uil-lock-alt",
                            "password")}
                        {isLogin && this.renderButton("Login")}
                        {!isLogin && this.renderInput(
                            "title",
                            "Movie Title",
                            "form-group",
                            "material-symbols:movie-filter",
                            "text",
                            false
                        )}
                        {!isLogin && this.renderSelect("genreId",
                            "Genre",
                            this.state.genres
                        )}
                        {!isLogin && this.renderInput(
                            "numberInStock",
                            "NumberInStock",
                            "form-group mt-2",
                            "gg:box",
                            "text",
                            false
                        )}
                        {!isLogin && this.renderInput(
                            "dailyRentalRate",
                            "DailyRentalRate",
                            "form-group mt-2",
                            "map-movie-rental",
                            "text",
                            false
                        )}
                        {!isLogin && this.renderButton("Save")}
                    </div>
                </div>
            </div>
        );
    };

    renderCardBack(label) {
        return (
            <div className="card-back">
                <div className="center-wrap">
                    <div className="section text-center">
                        <h4 className="mb-4 pb-3">{label}</h4>
                        {this.renderInput(
                            "name",
                            "Your Full Name",
                            "form-group",
                            "input-icon uil uil-user",
                        )}
                        {this.renderInput(
                            "email",
                            "Your Email",
                            "form-group mt-2",
                            "input-icon uil uil-at",
                            "email"
                        )}
                        {this.renderInput(
                            "password",
                            "Your Password",
                            "form-group mt-2",
                            "input-icon uil uil-lock-alt",
                            "password"
                        )}
                        {this.renderButton("Register")}
                    </div>
                </div>
            </div>
        );
    };

    renderButton(label) {
        return (
            <button
                className="form-btn mt-4">
                {label}
            </button>
        );
    };

    renderInput(name, label, className, icon, type = 'text', isUIL = true ) {
        const {account, errors} = this.state;

        return (
            <Input
                icon={icon}
                className={className}
                isUIL={isUIL}
                type={type}
                name={name}
                value={account[name]}
                onChange={this.handleChange}
                label={label}
                error={errors[name]}
            />
        );
    };

    renderSelect(name, label, options) {
        const {account, errors} = this.state;

        return (
            <Select
                name={name}
                value={account[name]}
                onChange={this.handleChange}
                label={label}
                error={errors[name]}
                options={options}
            />
        );
    };
}

export default Form;