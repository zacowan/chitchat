import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Divider from '@material-ui/core/Divider';
import {useTransition, animated} from 'react-spring';

// Custom components
import {withFirebase} from '../components/Firebase';
import FormDialog from '../components/FormDialog';
import InputPromptModal from '../components/InputPromptModal';

// Styled components
const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  min-height: 100vh;
`;

const Home = ({firebase}) => {
  const [rooms, setRooms] = useState([]);
  const [needsName, setNeedsName] = useState(false);
  useEffect(() => {
    const unsubscribe = firebase.attachChatRoomListener(setRooms);
    if (firebase.getDisplayName() === null) {
      setNeedsName(true);
    }
    return () => {
      unsubscribe();
    };
  }, []);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:820px)');

  const transitions = useTransition(rooms, room => room.id, {
    from: {transform: 'translate3d(-40px,0,0)'},
    enter: {transform: 'translate3d(0,0px,0)'},
    leave: {transform: 'translate3d(-40px,0,0)'}
  });

  const createChatRoom = async value => {
    const room = await firebase.createChatRoom(value);
    joinChatRoom(room);
  };

  const joinChatRoom = room => {
    const {id, nickname} = room;
    history.push(`/chatroom/${id}`, {nickname: nickname});
  };

  const joinChatRoomById = async value => {
    const room = await firebase.joinChatRoomById(value);
    joinChatRoom(room);
  };

  const setDisplayName = async value => {
    await firebase.setDisplayName(value);
    setNeedsName(false);
  };

  const renderRoomCard = ({props, key, item}) => {
    const room = item;
    return (
      <GridListTile key={key} cols={1} component={animated.div} style={props}>
        <Card elevation={8} raised>
          <CardContent>
            <Typography variant='h6'>{room.nickname}</Typography>
            <Typography variant='subtitle2'>ID: {room.id}</Typography>
            <Typography variant='subtitle2'>Members: {room.members}</Typography>
          </CardContent>
          <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              color='primary'
              variant='contained'
              onClick={() => joinChatRoom(room)}
            >
              Join
            </Button>
          </CardActions>
        </Card>
      </GridListTile>
    );
  };

  return (
    <RootContainer>
      <InputPromptModal
        open={needsName}
        title='Enter A Name'
        description='This name will be used to identify you in chat rooms.'
        inputLabel='Name'
        submitLabel='Done'
        onSubmit={setDisplayName}
      />
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
            onSubmit={joinChatRoomById}
          >
            Join Room
          </FormDialog>
        </Toolbar>
      </AppBar>
      <section
        style={{flex: 1, marginTop: 40, marginLeft: 20, marginRight: 20}}
      >
        <Container>
          <Typography variant='h4'>Available Chat Rooms</Typography>
          <Divider style={{marginBottom: 20}} />
          <GridList cols={isMobile ? 1 : 3} cellHeight='auto' spacing={40}>
            {transitions.map(renderRoomCard)}
          </GridList>
        </Container>
      </section>
    </RootContainer>
  );
};

export default withFirebase(Home);
