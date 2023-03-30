import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCPuI-iQrh3auGkHleWUU7PNxMV0UFcZ48",
    authDomain: "learn-global.firebaseapp.com",
    databaseURL: "https://learn-global.firebaseio.com",
    projectId: "learn-global",
    storageBucket: "learn-global.appspot.com",
    messagingSenderId: "1040801243645",
    appId: "1:1040801243645:web:a3b565edaa8c08749e7994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
const messaging = getMessaging(app);

// export const fbDatabase = getDatabase(app);
// export const fStore = getFirestore(app);
// export const fStorage = getStorage(app);

export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, { vapidKey: "BPTVXX47IeUG2ows6NVdqqCW7RD1El30GqHG9MWqxzzSpECGDjEHGcwCL5aVGaJR1MUnhxhV7jaurSg0BGN1Mrs" });
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            return currentToken;
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            return "FALSE"
        }
    } catch (err) {
        return "FALSE"
        console.log('An error occurred while retrieving token. ', err);
    }
};


export const onMessageListener = () => {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload)
            resolve(payload);
        });
    });
}
// onMessageListener()