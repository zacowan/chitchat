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
  }

  getDisplayName = () => {
    return this.auth.currentUser.displayName;
  };

  setDisplayName = async value => {
    await this.auth.currentUser.updateProfile({displayName: value});
  };

  signIn = () => {
    return this.auth.signInAnonymously();
  };

  checkUser = () => {
    return this.auth.currentUser ? true : false;
  };

  getUser = () => {
    return this.auth.currentUser;
  };

  createChatRoom = async nickname => {
    const ref = this.firestore.collection('rooms').doc();
    const data = {
      nickname: nickname,
      id: ref.id,
      timestamp: firebase.firestore.Timestamp.now()
    };
    await ref.set(data);
    return data;
  };

  joinChatRoomById = async id => {
    const ref = this.firestore.collection('rooms').doc(id);
    const snap = await ref.get();
    const data = snap.data();
    return data;
  };

  sendMessage = async (roomId, content) => {
    const ref = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc();
    const data = {
      content: content,
      author: {
        displayName: this.getDisplayName(),
        uid: this.auth.currentUser.uid
      },
      timestamp: firebase.firestore.Timestamp.now()
    };
    await ref.set(data);
    return data;
  };

  attachChatRoomListener = callback => {
    const ref = this.firestore
      .collection('rooms')
      .orderBy('timestamp', 'desc')
      .limitToLast(50);
    const unsubscriber = ref.onSnapshot(snap => {
      console.log('Grabbed some rooms!');
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

  attachMessageListener = (roomId, callback) => {
    const ref = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .limitToLast(50);
    const unsubscriber = ref.onSnapshot(snap => {
      console.log('Grabbed some messages!');
      let messages = [];
      snap.docs.forEach(doc => {
        const data = doc.data();
        messages = [...messages, data];
      });
      callback(messages);
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
