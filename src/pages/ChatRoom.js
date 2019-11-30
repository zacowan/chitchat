import React, {useState, useEffect} from 'react';
import {useParams, useLocation, Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import {useTransition, animated} from 'react-spring';
import {animateScroll} from 'react-scroll';

// Custom components
import {withFirebase} from '../components/Firebase';
import MessageBar from '../components/MessageBar';

// TODO: Scroll to bottom when messages is updated

const ChatRoom = ({firebase}) => {
  const location = useLocation();
  const roomNickname = location.state.nickname;
  const {roomId} = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.attachMessageListener(roomId, val => {
      setMessages(val);
      animateScroll.scrollToBottom({
        containerId: 'message-container',
        duration: 0
      });
    });
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
        style={{display: 'flex', ...props}}
        component={animated.div}
        key={key}
      >
        <Paper
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '50%'
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
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column'
      }}
    >
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' style={{flex: 1}}>
            ChitChat
          </Typography>
          <Button color='inherit' component={Link} to='/'>
            Leave Room
          </Button>
        </Toolbar>
      </AppBar>
      <section style={{marginTop: 40, marginLeft: 20, marginRight: 20}}>
        <Container>
          <Typography variant='h4'>{roomNickname}</Typography>
          <Typography variant='subtitle1'>Room ID: {roomId}</Typography>
          <Divider style={{marginBottom: 20}} />
        </Container>
      </section>
      <section
        style={{
          flex: 1,
          overflow: 'scroll'
        }}
        id='message-container'
      >
        <Container>
          <List>{transitions.map(renderMessage)}</List>
        </Container>
      </section>
      <section>
        <MessageBar onSubmit={sendMessage} />
      </section>
    </div>
  );
};

export default withFirebase(ChatRoom);
