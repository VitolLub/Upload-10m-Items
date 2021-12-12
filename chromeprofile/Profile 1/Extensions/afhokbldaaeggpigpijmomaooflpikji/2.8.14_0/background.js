import { initializeApp } from './firebase-app.js';
//self.importScripts('./firebase-app.js');
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

chrome.runtime.onInstalled.addListener(function() {

    setTimeout(()=>{
        console.log('ye2a')
    },4000)

    // importScripts('./firebase-app.js');
    // importScripts('./firebase-messaging.js');


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./firebase-messaging-sw.js');
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }

    firebase.initializeApp({
        apiKey: "AIzaSyCQn8yLqDzj7UlbwSSD9TCza1YDl8MErFg",
        authDomain: "finish-b2556.firebaseapp.com",
        // databaseURL: "xx",
        projectId: "finish-b2556",
        storageBucket: "finish-b2556.appspot.com",
        messagingSenderId: "G-CSZYZW46MS",
        appId: "1:327533102861:web:90b2e8f6e6d55ef3c11244"
    });

    // const firebaseConfig = {
    //   apiKey: "AIzaSyCQn8yLqDzj7UlbwSSD9TCza1YDl8MErFg",
    //   authDomain: "finish-b2556.firebaseapp.com",
    //   projectId: "finish-b2556",
    //   storageBucket: "finish-b2556.appspot.com",
    //   messagingSenderId: "327533102861",
    //   appId: "1:327533102861:web:90b2e8f6e6d55ef3c11244",
    //   measurementId: "G-CSZYZW46MS"
    // };

    const messaging = firebase.messaging();
    messaging.usePublicVapidKey("BKMxqtzGi_vVA2YRWhg39oX0ToQHVwJxyBeEdW-jlbUDbZoQXkrahdf-iBR245pvoGYzslBfnf-M-_vTrJFBVRI");

    // WORK WELL
    messaging.requestPermission()
    .then(function() {
        console.log("=== have permission ===");
        return messaging.getToken();
    })
    .then(function(currentToken) {
        console.log("Set token : ", currentToken);
        chrome.storage.sync.set({fcmToken: currentToken}, function() {});
    })
    .catch(function(err) {
        console.log("==== error ====", err);
    });

    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
            console.log("Refresh token : ", refreshedToken);
            chrome.storage.sync.set({fcmToken: refreshedToken}, function() {});
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
        });
    });

    //Never trigger 
    messaging.onMessage((payload) => {
        chrome.browserAction.setBadgeText({text: "1"});
        console.log('Message received. ', payload);
    });
})