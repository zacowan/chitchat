import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React from 'react';
import firebaseConfig from '../firebaseConfig.json';

const FirebaseContext = React.createContext(null);

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.firestore = firebase.firestore();
    this.firestore.enablePersistence();
    this.auth = firebase.auth();
    this.signIn();
  }

  signIn = () => {
    return this.auth.signInAnonymously();
  };

  createChatRoom = async nickname => {
    const ref = this.firestore.collection('rooms').doc();
    const data = {nickname: nickname, id: ref.id};
    await ref.set(data);
    return data;
  };

  joinChatRoom = async id => {
    const ref = this.firestore.collection('rooms').doc(id);
    const snap = await ref.get();
    const data = snap.data();
    return data;
  };

  attachChatRoomListener = callback => {
    const ref = this.firestore.collection('rooms');
    const unsubscriber = ref.onSnapshot(snap => {
      let rooms = [];
      snap.docs.forEach(doc => {
        const data = doc.data();
        const {id, nickname} = data;
        rooms = [...rooms, {id: id, nickname: nickname, members: 0}];
      });
      callback(rooms);
    });
    return unsubscriber;
  };
}

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default Firebase;

export {FirebaseContext, withFirebase};
