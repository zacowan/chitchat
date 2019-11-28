import React, {useState, useEffect} from 'react';
import {useParams, useLocation, Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

// Custom components
import {withFirebase} from '../components/Firebase';

const ChatRoom = ({firebase, ...props}) => {
  const location = useLocation();
  const roomNickname = location.state.nickname;
  const {roomId} = useParams();

  const messages = [
    {
      author: {
        nickname: 'Test',
        uid: '1234'
      },
      message: 'Test message.',
      timestamp: Date.now()
    }
  ];

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
      <section style={{flex: 1}}>{/* Messages list goes here */}</section>
      <section>
        <Paper
          style={{
            padding: 10
          }}
        >
          <Container>
            <form
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TextField
                autoFocus
                margin='dense'
                label='Message'
                type='text'
                variant='outlined'
                fullWidth
                multiline
              />
              <Button color='primary' style={{marginLeft: 10}}>
                Send
              </Button>
            </form>
          </Container>
        </Paper>
      </section>
    </div>
  );
};

export default withFirebase(ChatRoom);
