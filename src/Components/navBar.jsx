import React from "react";
import {Link, NavLink} from 'react-router-dom';

const NavBar = ({user}) => {
    return (<div className="container-fluid px-0 ">
        <nav className="navbar navbar-expand-sm navbar-dark bg-black py-0 px-0">
            <Link className="navbar_logo_name" to="/"><img width="25"
                                                        height="25"
                                                        className="d-inline-block align-top App-logo"
                                                        alt="Zoe Logo"
                                                        src={require("../images/logo_nbg.png")}></img> ZOE</Link>
            <button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon "></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav justify-content-end">
                    <li className="nav-item active">
                        <NavLink className="nav-link sliding-u-l-r-l" to="/movies"> Movies</NavLink>
                    </li>
                    {!user && (<React.Fragment>
                        <li className={"nav-item"}>
                            <NavLink className="nav-link sliding-u-l-r-l" to="/login">
                                Login
                            </NavLink>
                        </li>
                    </React.Fragment>)}
                    {user && (<React.Fragment>
                        <li className={"nav-item"}>
                            <h6 className="nav-link sliding-u-l-r-l">
                                {user.name}
                            </h6>
                        </li>
                        <li className={"nav-item"}>
                            <NavLink className="nav-link sliding-u-l-r-l" to="/logout">
                                Logout
                            </NavLink>
                        </li>
                    </React.Fragment>)}
                </ul>
            </div>
        </nav>
    </div>);
}

export default NavBar;