import React, {useRef} from 'react';
import { useStyles } from '../app.styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface ChatFooterProps {
    sendMessage: (message: string) => void;
    userName: string | null;
}

const ChatFooter = ({
    sendMessage,
    userName
}: ChatFooterProps) => {
    const classes = useStyles();
    const messageRef = useRef<HTMLTextAreaElement|null>(null);

    const sendMessageHandler = () => {
      if(messageRef?.current?.value) {
        sendMessage(messageRef?.current?.value);
        messageRef.current.value = '';
      }
    }

    return (
        <div className={classes.chatOptions}>
        <TextField
             id="outlined-multiline-static"
             label="Multiline"
             multiline
             rows={4}
             defaultValue="Default Value"
             variant="outlined"
             className={classes.customInput}
             inputRef={messageRef}
         />
         <Button
             variant="contained"
             color="primary"
             className={classes.button}
             onClick={sendMessageHandler}
             disabled={!userName}
         >
             Send
         </Button>
     </div>
    ); 
}

export default ChatFooter;