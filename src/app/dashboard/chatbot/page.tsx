'use client';
import * as React from 'react';
import { useState } from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DefaultCommandConfig from './default-command-config';
import CustomCommandConfig from './custom-command-config';
import { DocumentationLink } from '@/util/common-components';
import SubmitUpdateButton from './submit-update-button';
import ForceJoinButton from './force-join-button';

type CommandGroup = 'default_commands' | 'custom_commands';

type MEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export default function ChatBotConfig() {

  const [commandGroup, setCommandGroup] = useState<CommandGroup>('default_commands');

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
        <SubmitUpdateButton />
      </Box>
    </Paper>
    <GroupDisplay commandGroup={commandGroup} />
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
