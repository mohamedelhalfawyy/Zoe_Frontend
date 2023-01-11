import React from "react";
import auth from "../../Services/authService";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    return (
        !auth.getCurrentUser() ? <Navigate
            to="/login"
        /> : <Outlet />
    );
}

export default ProtectedRoute;