import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const InputPromptModal = props => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!text) {
        throw {
          code: 'input/empty',
          message: 'Error: field must not be empty.'
        };
      }
      await props.onSubmit(text);
    } catch (error) {
      const code = error.code;
      const msg = error.message;
      setError(msg);
      setLoading(false);
    }
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle style={{zIndex: 4}}>{props.title}</DialogTitle>
      <DialogContent>
        <React.Fragment>
          <DialogContentText>{props.description}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            value={text}
            onChange={e => setText(e.currentTarget.value)}
            label={props.inputLabel}
            fullWidth
            error={error ? true : false}
            helperText={error ? error : ''}
            type='text'
            variant='outlined'
          />
        </React.Fragment>
        {loading && (
          <Box
            bgcolor='background.paper'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 3
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color='primary'>
          {props.submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputPromptModal;
