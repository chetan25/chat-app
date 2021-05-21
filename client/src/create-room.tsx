import React, {useRef} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
  }),
)

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export const CreateRoom = ({
    onClose,
    onSave,
    open = false
}: Props) => {
    const classes = useStyles();
    const nameRef = useRef<HTMLInputElement>(null);

    const createRoom = () => {
        if (nameRef && nameRef!.current) {
            onSave(nameRef!.current!.value);
        }
       
    }

    return (
      <div>
        <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={onClose}>
          <DialogTitle>Create Public Room</DialogTitle>
          <DialogContent>
            <FormControl className={classes.formControl}>
                <TextField inputRef={nameRef} required id="standard-required" label="Required" defaultValue="" />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={createRoom} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }