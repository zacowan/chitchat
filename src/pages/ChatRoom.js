import React, {useState, useEffect} from 'react';
import {useParams, useLocation, Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/ListItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import {useTransition, animated} from 'react-spring';

// Custom components
import {withFirebase} from '../components/Firebase';
import MessageBar from '../components/MessageBar';

const ChatRoom = ({firebase}) => {
  const location = useLocation();
  const roomNickname = location.state.nickname;
  const {roomId} = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.attachMessageListener(roomId, setMessages);
    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async content => {
    await firebase.sendMessage(roomId, content);
  };

  const transitions = useTransition(
    messages,
    message => message.content + message.author.uid + message.timestamp,
    {
      from: {transform: 'translate3d(-40px,0,0)'},
      enter: {transform: 'translate3d(0,0px,0)'},
      leave: {transform: 'translate3d(-40px,0,0)'}
    }
  );

  const renderMessage = ({props, key, item}) => {
    const selfAuthored = item.author.uid === firebase.getUser().uid;
    if (selfAuthored) {
      props = {
        justifyContent: 'flex-end',
        ...props
      };
    }
    return (
      <ListItem
        style={{maxWidth: '45%', display: 'flex', ...props}}
        component={animated.div}
        key={key}
      >
        <Paper
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {!selfAuthored && (
            <ListItemAvatar>
              <Avatar style={{backgroundColor: 'blue'}}>
                {item.author.displayName.substr(0, 1)}
              </Avatar>
            </ListItemAvatar>
          )}
          <ListItemText primary={item.content} />
        </Paper>
      </ListItem>
    );
  };

  return (
    <div
      style={{
        maxHeight: '100vh',
        backgroundColor: 'red',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column'
      }}
    >
      <section>
        <Paper
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Button style={{marginLeft: 20}} component={Link} to='/'>
            Back
          </Button>
          <Container style={{paddingTop: 20, paddingBottom: 20}}>
            <Typography variant='h3'>{roomNickname}</Typography>
            <Typography variant='subtitle1'>Room ID: {roomId}</Typography>
          </Container>
        </Paper>
      </section>
      <section
        style={{
          flex: 1,
          backgroundColor: 'blue'
        }}
      >
        <List>
          {transitions.map(({item, props, key}) =>
            renderMessage({item, props, key})
          )}
        </List>
      </section>
      <section>
        <MessageBar onSubmit={sendMessage} />
      </section>
    </div>
  );
};

export default withFirebase(ChatRoom);
