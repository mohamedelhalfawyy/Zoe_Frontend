import React, {Component} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import Movies from "./Components/movies";
import MovieForm from "./Components/movieForm";
import NotFound from "./Components/notFound";
import NavBar from "./Components/navBar";
import LoginForm from "./Components/loginForm";
import Logout from "./Components/logout";
import ProtectedRoute from "./Components/common/protectedRoute";
import auth from "./Services/authService";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

class App extends Component {
    state = {};

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({user});
    }


    render() {
        const {user} = this.state;

        return (
            <div className={"main-content"}>
                <React.Fragment>
                    <ToastContainer/>
                    <NavBar user={this.state.user}/>
                    <main className={"container"}>
                        <Routes>
                            <Route path="/login" element={<LoginForm/>}/>
                            <Route path="/logout" element={<Logout/>}/>
                            <Route path="/movies/:id" element={<ProtectedRoute />} >
                                <Route path='/movies/:id' element={<MovieForm />}/>
                            </Route>
                            <Route path="/movies" element={<Movies user={user}/>}/>
                            <Route path="/not-found" element={<NotFound/>}/>
                            <Route path="/" exact element={<Navigate to="/movies"/>}/>
                            <Route path="/Zoe_Frontend" element={<Navigate to="/movies"/>}/>
                            <Route path="*" element={<Navigate to="/not-found" replace/>}/>
                        </Routes>
                    </main>
                </React.Fragment>
            </div>
        );
    }
}

export default App;