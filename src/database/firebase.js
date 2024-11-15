import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAf8G-XtjUy8dJXs6BbqJU6Ss-W3eOA4-w",
  authDomain: "crudwithfirebase-54a91.firebaseapp.com",
  projectId: "crudwithfirebase-54a91",
  storageBucket: "crudwithfirebase-54a91.firebasestorage.app",
  messagingSenderId: "495467054178",
  appId: "1:495467054178:web:739c4b34e8b4bde82f7d3b"
};

firebase.initializeApp(firebaseConfig);

export { firebase }