import axios from "axios";
import logger from "./logService";
import {toast} from "react-toastify";


axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if (error.code === 'ERR_NETWORK') {
        logger.log(error);
        toast.error("Couldn't Connect to Backend!");
    }

    else if (!expectedError) {
        logger.log(error);
        toast.error("An Unexpected error occurred");
    }

    return Promise.reject(error);
});

function setJwt(jwt) {
    axios.defaults.headers.common['x-auth-token'] = jwt;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
}