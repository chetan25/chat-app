import React, { useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
      noLabel: {
        marginTop: theme.spacing(3),
      },
  }),
)

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
    open: boolean;
    availableRooms: string[];
    selectedRooms: string[];
    onClose: () => void;
    onSave: (selections: string[]) => void;
}

export const RoomDialogSelect = ({
    onClose,
    onSave,
    open = false,
    availableRooms = [],
    selectedRooms = []
}: Props) => {
    const classes = useStyles();
    const [currentSelection, setCurrntSelection] = React.useState<string[]| undefined>();
  
    useEffect(() => {
       setCurrntSelection(selectedRooms);
    }, [selectedRooms]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCurrntSelection(event.target.value as string[]);
    };

    if (!currentSelection) {
        return null;
    }

    return (
      <div>
        <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={onClose}>
          <DialogTitle>Select Rooms</DialogTitle>
          <DialogContent>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={currentSelection}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                    MenuProps={MenuProps}
                >
                {availableRooms.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={currentSelection.indexOf(name) > -1} disabled={name == 'Public'} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => onSave(currentSelection)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }