import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useStyles } from '../app.styles';
import {  Rooms } from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: string) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

interface ChatBodyProps {
    userId: string | null;
    rooms: Rooms;
    currentRooom: string;
    setCurrentRoom: (name: string) => void;
}

const ChatBody = ({
    userId,
    rooms,
    currentRooom,
    setCurrentRoom
}: ChatBodyProps) => {
    const classes = useStyles();
    
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        console.log('changed', newValue);
        setCurrentRoom(newValue);
    };

    const getClassNane = (id: string) => {
        switch(id) {
          case '1':
            return classes.serverStyle;
          case userId: 
            return classes.currentUserStyle;
          default:
            return classes.normalMessageStyle;
        }
    }

    return (
        <div className={classes.chatTabs}>
        {
          userId ? <AppBar position="static" color="default">
            <Tabs
              value={currentRooom}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="romms avialbale"
            >
              {
                  Object.keys(rooms).map((roomName, index) => {
                    return <Tab value={roomName} label={roomName} key={index} {...a11yProps(roomName)} />
                  })
              }
            </Tabs>
          </AppBar> :<Typography variant="h4" gutterBottom>
            Please Enter a name to start
          </Typography>
        } 
        {
            rooms ? Object.values(rooms).map(({messages, roomName}, index) => {
              return <TabPanel value={currentRooom} index={roomName} key={index}>
                <div className={classes.chatArea}>
                      {
                          messages.map((message, index) => {
                            return <p key={index} className={getClassNane(message.senderId)}>
                              {`${message.senderName}:  ${message.message}`}
                            </p>
                          })
                      }
                </div>
              </TabPanel>
            }) : null
        }
      </div>
    );
}

export default ChatBody;