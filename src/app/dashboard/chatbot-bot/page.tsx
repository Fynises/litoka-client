'use client';
import * as React from 'react';
import { useState } from 'react';
import { Alert, Box, Button, Paper, Snackbar, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import DefaultCommandConfig from './default-command-config';
import CustomCommandConfig from './custom-command-config';
import { ApiDefaultCommands } from './default-commands';
import { ChatBotContext, ChatBotState } from './chatbot-context';
import { ApiCustomCommands } from './custom-commands';
import axios from 'axios';
import authHelper from '@/auth-util/auth-provider';
import apiClient from '@/util/api-client';
import { DocumentationLink } from '@/util/common-components';

type CommandGroup = 'default_commands' | 'custom_commands';

type MEvent = React.MouseEvent<HTMLElement, MouseEvent>;

async function requestForceJoin(): Promise<null> {
  return axios.post('/api/chat-bot/force-join', null, apiClient.getHeader());
}

export default function ChatBotConfig() {

  const [commandGroup, setCommandGroup] = useState<CommandGroup>('default_commands');
  const [defaultCommands, setDefaultCommands] = useState<ApiDefaultCommands>();
  const [customCommands, setCustomCommands] = useState<ApiCustomCommands>();

  const context: ChatBotState = {
    defaultCommands: defaultCommands,
    setDefaultCommands: setDefaultCommands,
    customCommands: customCommands,
    setCustomCommands: setCustomCommands,
  };

  const handleChange = (_e: MEvent, val: string) => {
    setCommandGroup(val as CommandGroup);
  };

  return (<>
    <Paper elevation={0} sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2
    }}>
      <ToggleButtonGroup
        size='small'
        color='primary'
        value={commandGroup}
        exclusive
        onChange={handleChange}
        sx={{ margin: 1 }}
      >
        <ToggleButton value='default_commands'>Default Commands</ToggleButton>
        <ToggleButton value='custom_commands'>Custom Commands</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', }}>
        <DocumentationLink path='/docs/category/chat-bot' text='documentation' />
        <ForceJoinButton />
      </Box>
    </Paper>
    <ChatBotContext.Provider value={context}>
      <GroupDisplay commandGroup={commandGroup} />
    </ChatBotContext.Provider>
  </>);

}

interface GroupDisplayProps {
  commandGroup: CommandGroup,
}

function GroupDisplay(props: GroupDisplayProps) {
  switch (props.commandGroup) {
    case 'default_commands':
      return (
        <Box sx={{ marginTop: 1 }}>
          <DefaultCommandConfig />
        </Box>
      );
    case 'custom_commands':
      return (
        <Box sx={{ marginTop: 1 }}>
          <CustomCommandConfig />
        </Box>
      );
  }
}

function ForceJoinButton() {

  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string>('');

  const handleForceJoin = () => {
    requestForceJoin()
      .then(() => setSuccessOpen(true))
      .catch(e => {
        if (axios.isAxiosError(e)) {
          setErrorCode(`${e.code}`);
          setErrorOpen(true);
        } else {
          setErrorCode('unknown error');
          setErrorOpen(true);
        }
      });
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    setErrorCode('');
  };

  return (
    <>
      <Tooltip title='request bot to join your channel'>
        <Button variant='contained' disableElevation={true} size='small' onClick={handleForceJoin} sx={{
          borderRadius: 4,
          marginRight: 2
        }}>
          join channel
        </Button>
      </Tooltip>
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={() => setSuccessOpen(false)}>
        <Alert variant='filled' onClose={() => setSuccessOpen(false)} severity='success'>
          Successfully sent request
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert variant='filled' onClose={handleErrorClose} severity='success'>
          Error sending request: {errorCode}
        </Alert>
      </Snackbar>
    </>
  );
}
