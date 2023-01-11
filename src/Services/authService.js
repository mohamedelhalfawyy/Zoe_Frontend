import http from './httpService';
import config from '../config.json';
import jwtDecode from "jwt-decode";

const apiEndPoint = config.apiUrl + "/auth";
const tokenKey = 'token';

http.setJwt(localStorage.getItem(tokenKey));

export async function login(email, password) {
    const {data: jwt} = await http.post(apiEndPoint, {email, password});
    localStorage.setItem(tokenKey, jwt);
}

export function loginByJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function logout() {
    localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);

        return jwtDecode(jwt);
    } catch (ex) {
        return null;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    login,
    logout,
    getCurrentUser,
    loginByJwt,
}