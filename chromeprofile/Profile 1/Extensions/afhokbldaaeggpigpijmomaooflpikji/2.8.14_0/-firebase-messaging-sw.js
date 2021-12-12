// importScripts('/assets/pwa/firebase-app-compat.js');
// importScripts('/assets/pwa/firebase-messaging-compat.js');

//importScripts('/assets/pwa/firebase-app-compat.js');
// importScripts('');
//importScripts('/assets/pwa/firebase-app-compat.js');
// import { initializeApp } from './assets/pwa/firebase-app.js';
// //import { getMessaging } from './assets/pwa/firebase-messaging.js';
// import { getMessaging } from "firebase/messaging";

import { initializeApp } from 'firebase/app';

let firebase = initializeApp({
	apiKey: "AIzaSyDh5KSspb9_xGZOhImCTRO1uUn35kGX4Y8",
	// authDomain: "hip-polymer-318314.firebaseapp.com",
	projectId: "hip-polymer-318314",
	// storageBucket: "finish-b2556.appspot.com",
	messagingSenderId: "23475543785",
	appId: "1:23475543785:web:e2418f61063f6001135a78"
});


// let token = app.getToken()
// console.log('token', token)

//const messaging = getMessaging();

// messaging.requestPermission()
// .then(function() {
// 	console.log('Notification permission granted.');
// 	messaging.getToken()
// 	.then(function(currentToken) {
// 		if (currentToken) {
// 			console.log(currentToken);
// 		} else {
// 			console.log('No Instance ID token available. Request permission to generate one.');
// 		}
// 	})
// 	.catch(function(err) {
// 		console.log('An error occurred while retrieving token. ', err);
// 	});
// })
// .catch(function(err) {
// 	console.log('Unable to get permission to notify. ', err);
// });