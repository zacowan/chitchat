import React, {useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const FormDialog = props => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setError(null);
    setOpen(false);
  };

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
    <div>
      <Button
        onClick={handleClickOpen}
        color='inherit'
        style={{marginLeft: 5, marginRight: 5}}
      >
        {props.children}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{zIndex: 4}}>{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <React.Fragment>
            <DialogContentText>{props.dialogDescription}</DialogContentText>
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
          <Button onClick={handleClose} color='primary'>
            {props.cancelLabel || 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            {props.submitLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
