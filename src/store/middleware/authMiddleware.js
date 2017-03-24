import AuthActions from "./../actions/authActions";
import LocalStorageManager from '../../services/localStorageManager'
import * as firebase from 'firebase';
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

        // firebase.auth()
        //         .createUserWithEmailAndPassword(credentials.email, credentials.password)
        //         .then(function (authUser){
        //             console.log("signup successfull ",authUser);
        //             AuthMiddleware.createUserInFirebase(dispatch,credentials,authUser);
        //         })
        //         .catch(function(error) {
        //             //var errorCode = error.code;
        //             //var errorMessage = error.message;
        //             console.log("signup error ",error);
        //             dispatch(AuthActions.signupRejected(error));
        //         });

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
        instance.post("/login",{email:credentials.email,password:credentials.password})
        .then(response => response.data)
        .then(body => {
            console.log(body)
            LocalStorageManager.setUser(body)
            dispatch(AuthActions.signinSuccessful(body));
        })
        .catch(error =>{
            console.log(error)
            dispatch(AuthActions.signinRejected(error));
        })



        // firebase.auth()
        //     .signInWithEmailAndPassword(credentials.email, credentials.password)
        //     .then(function (authUser) {
        //         console.log("singIN successfull ", authUser);
        //         AuthMiddleware.getUserFromFirebase(dispatch, authUser);
        //     })
        //     .catch(function (error) {
        //         //var errorCode = error.code;
        //         //var errorMessage = error.message;
        //         console.log("signup error ", error);
        //         dispatch(AuthActions.signinRejected(error));
        //     });

    }

    // static getUserFromFirebase(dispatch, authUser) {
    //     firebase.database().ref('/')
    //         .child(`users/${authUser.uid}`)
    //         .once('value')
    //         .then(function (userObj) {
    //             console.log("user after login ", userObj.val());
    //             LocalStorageManager.setUser(userObj.val())
    //             dispatch(AuthActions.signinSuccessful(userObj.val()));
    //         });
    // Signin Functions Ends


    // Logout Functions Starts
    static logout() {
        return (dispatch) => {
            dispatch(AuthActions.logout())
            AuthMiddleware.logoutFromFirebase(dispatch);
        }
    }

    static logoutFromFirebase(dispatch) {
        LocalStorageManager.removeUser();
        firebase.auth().signOut()
            .then(function () {
                dispatch(AuthActions.logoutSuccessful())
            })
            .catch(function (error) {
                console.log("Error in lougout ", error);
                dispatch(AuthActions.logoutSuccessful())
            })

    }

    // Logout Functions Ends

    // isLoggedIn 
    static isLoggedIn() {
        return (dispatch) => {
            let user = LocalStorageManager.getUser();
            if (user) {
                dispatch(AuthActions.signinSuccessful(user))
            }
            else {
                console.log("not logged in ");
                // dispatch(AuthActions.signinSuccessful(user))
            }
        }
    }




    static updateUser(authUser) {
        return (dispatch) => {
            firebase.database().ref('/')
                .child(`users/${authUser.uid}`)
                .once('value')
                .then(function (userObj) {
                    console.log("user after update ", userObj.val());
                    LocalStorageManager.setUser(userObj.val())
                    dispatch(AuthActions.updateUser(userObj.val()));
                });
        }
    }


}



