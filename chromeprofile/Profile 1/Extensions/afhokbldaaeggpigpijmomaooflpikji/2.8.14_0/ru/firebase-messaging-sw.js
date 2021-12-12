importScripts('/assets/pwa/firebase-app-compat.js');
importScripts('/assets/pwa/firebase-messaging-compat.js');

firebase.initializeApp({
      apiKey: "AIzaSyDh5KSspb9_xGZOhImCTRO1uUn35kGX4Y8",
      // authDomain: "hip-polymer-318314.firebaseapp.com",
      projectId: "hip-polymer-318314",
      // storageBucket: "finish-b2556.appspot.com",
      messagingSenderId: "23475543785",
      appId: "1:23475543785:web:e2418f61063f6001135a78"
    });

const messaging = firebase.messaging();
const SW_VERSION = '1.0.0';


try{

    const broadcast = new BroadcastChannel('mt-sw-channel');
    
    this.onpush = event => {
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            })
            .then(function(windowClients) {
                let data = event.data.json()
    
                let can_show = false
    
                let client
    
                if (!data.data.show_always){
                    for (var i = 0; i < windowClients.length; i++) {
                        client = windowClients[i];
    
                        if (client.visibilityState == 'hidden'){
                            can_show = true
                        }
                    }
                }
        
                let notificationTitle = data.data.title;
                let notificationOptions = {
                    body: data.data.body,
                    icon: data.data.icon,
                    data: {
                        url: data.data.url
                    }
                };
                
                console.log('data 5', data)
    
                if (can_show || data.data.show_always){
                    return self.registration.showNotification(notificationTitle, notificationOptions);
                } else
                    return null
            })
        )
    };
    
    self.addEventListener('notificationclick', function(event) {
        console.log('event click 3', event)
    
        event.notification.close(); // Android needs explicit close.
    
        if (event.notification.data.url){
            event.waitUntil(
                clients.matchAll({type: 'window'}).then( windowClients => {
                    // Check if there is already a window/tab open with the target URL
                    for (var i = 0; i < windowClients.length; i++) {
                        var client = windowClients[i];
                        // If so, just focus it.
                        if (client.url === event.notification.data.url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // If not, then open the target URL in a new window/tab.
                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.url);
                    }
                })
            );
        }
    });
    
    broadcast.onmessage = (event) => {
        if (event.data && event.data.action == 'f-refresh') {
            broadcast.postMessage({ action: 'sw-version', data:SW_VERSION});
            self.skipWaiting();
        }
    };
} catch(e){
    console.error(e)
}