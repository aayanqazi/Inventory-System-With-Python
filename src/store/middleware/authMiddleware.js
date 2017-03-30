import AuthActions from "./../actions/authActions";
import LocalStorageManager from '../../services/localStorageManager'
import { instance } from "../../config/server"
export default class AuthMiddleware {

    /// Singup Functions start
    static signup(credentials) {
        console.log("test ", credentials);
        return (dispatch) => {
            dispatch(AuthActions.signup())
            AuthMiddleware.registerUser(dispatch, credentials);
        }
    }

    static registerUser(dispatch, credentials) {
        instance.post("/signup", { name: credentials.fullName, email: credentials.email, password: credentials.password, Role: true })
            .then(response => response.data)
            .then(body => {
                console.log(body);
                dispatch(AuthActions.signupupSuccessful());

            })
            .catch(error => {
                console.log(error);
                dispatch(AuthActions.signupRejected(error));
            })



    }
    // Signup Functions Ends



    // Signin Functions Starts
    static signin(credentials) {
        console.log("test ", credentials);
        return (dispatch) => {
            dispatch(AuthActions.signin())
            AuthMiddleware.authenticateUser(dispatch, credentials);
        }
    }

    static authenticateUser(dispatch, credentials) {
        instance.post("/login", { email: credentials.email, password: credentials.password })
            .then(response => response.data)
            .then(body => {
                console.log(body)
                LocalStorageManager.setUser(body)
                dispatch(AuthActions.signinSuccessful(body));
            })
            .catch(error => {
                console.log(error)
                dispatch(AuthActions.signinRejected(error));
            })




    }


    // Signin Functions Ends


    // Logout Functions Starts
    static logout() {
        return (dispatch) => {
            dispatch(AuthActions.logout())
            AuthMiddleware.logoutFromDatabase(dispatch);
        }
    }

    static logoutFromDatabase(dispatch) {
        LocalStorageManager.removeUser();

        dispatch(AuthActions.logoutSuccessful())


    }

    // Logout Functions Ends

    // isLoggedIn 
    static isLoggedIn() {
        return (dispatch) => {
            let user = LocalStorageManager.getUser();
            let token = user.data.token;
            if (user) {
                instance("/getProducts", instance.defaults.headers.token = token)
                    .then(response => response.data)
                    .then(body => {
                        dispatch(AuthActions.signinSuccessful(user))
                    })
                    .catch(error => {
                        console.log("not logged in ");
                    })
            }
            else {
                console.log("not logged in ");
                // dispatch(AuthActions.signinSuccessful(user))
            }
        }
    }







}



