import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Custom components
import {withFirebase} from '../components/Firebase';
import FormDialog from '../components/FormDialog';

// Styled components
const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  min-height: 100vh;
  background-color: red;
`;

const Home = ({firebase}) => {
  const [rooms, setRooms] = useState([]);
  // TODO: Listen event runs on every frame. NOT GOOD
  // useEffect(() => {
  //   const unsubscribe = firebase.attachChatRoomListener(vals => {
  //     console.log('Listened!');
  //     setRooms(vals);
  //   });
  //   return unsubscribe;
  // }, [rooms]);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:820px)');
  const createChatRoom = async value => {
    const {id, nickname} = await firebase.createChatRoom(value);
    history.push(`/chatroom/${id}`, {nickname: nickname});
  };
  const joinChatRoom = async value => {
    const {id, nickname} = await firebase.joinChatRoom(value);
    history.push(`/chatroom/${id}`, {nickname: nickname});
  };
  return (
    <RootContainer>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' style={{flex: 1}}>
            ChitChat
          </Typography>
          <FormDialog
            dialogTitle='Create A Chat Room'
            dialogDescription='Enter a nickname for the chat room you want to create. Each chat room has a unique id, separate from its nickname.'
            inputLabel='Nickname'
            submitLabel='Create'
            onSubmit={createChatRoom}
          >
            Create Room
          </FormDialog>
          <FormDialog
            dialogTitle='Join A Chat Room'
            dialogDescription='Enter the unique id of the chat room that you want to join. Each chat room has a unique id, separate from its nickname.'
            inputLabel='Unique ID'
            submitLabel='Join'
            onSubmit={joinChatRoom}
          >
            Join Room
          </FormDialog>
        </Toolbar>
      </AppBar>
      <section
        style={{flex: 1, marginTop: 40, marginLeft: 20, marginRight: 20}}
      >
        <Container>
          <GridList cols={isMobile ? 1 : 3} cellHeight='auto' spacing={20}>
            {rooms.map(room => (
              <GridListTile key={room.id} cols={1}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{room.nickname}</Typography>
                    <Typography variant='subtitle2'>ID: {room.id}</Typography>
                    <Typography variant='subtitle2'>
                      Members: {room.members}
                    </Typography>
                    {/* <div style={{height: 100}} /> */}
                  </CardContent>
                  <CardActions
                    style={{display: 'flex', justifyContent: 'flex-end'}}
                  >
                    <Button
                      color='primary'
                      onClick={() => joinChatRoom(room.id)}
                    >
                      Join
                    </Button>
                  </CardActions>
                </Card>
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </section>
    </RootContainer>
  );
};

export default withFirebase(Home);
