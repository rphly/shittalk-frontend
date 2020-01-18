import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBvNEL6wQ6bDBJDmCCYgIBXw1Qe0hTZ7Tk",
    authDomain: "shittalk-1b8fe.firebaseapp.com",
    databaseURL: "https://shittalk-1b8fe.firebaseio.com",
    projectId: "shittalk-1b8fe",
    storageBucket: "shittalk-1b8fe.appspot.com",
    messagingSenderId: "737351336330",
    appId: "1:737351336330:web:e0f8c1144bc647b77a0873",
    measurementId: "G-0BGQ03940K"
}
firebase.initializeApp(config)
firebase.firestore().settings({
})

export const fb = firebase
export const db = firebase.firestore()
//export const myStorage = firebase.storage()