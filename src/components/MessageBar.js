import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const MessageBar = props => {
  const [value, setValue] = useState('');
  const handleSubmit = () => {
    props.onSubmit(value);
    setValue('');
  };
  return (
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
          onSubmit={event => {
            handleSubmit();
            event.preventDefault();
          }}
        >
          <TextField
            autoFocus
            margin='dense'
            label='Message'
            type='text'
            variant='outlined'
            value={value}
            onChange={e => setValue(e.currentTarget.value)}
            fullWidth
          />
          <Button
            color='primary'
            style={{marginLeft: 10}}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </form>
      </Container>
    </Paper>
  );
};

export default MessageBar;
