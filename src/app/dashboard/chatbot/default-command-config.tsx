import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Divider,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import _ from 'lodash';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { useSelector } from 'react-redux';
import { JsonDefaultCommand } from '@/redux-store/models/chatbot-default-config';
import { loadDefaultCommands } from './api-default-commands';
import { loadConfig } from '@/redux-store/models/chatbot-default-config';
import getDescription from './default-descriptors';
import CommandEnableSwitch from './switch-enable-box';
import SettingsTray from './settings-tray';

export default function DefaultCommandConfig() {

  const selector = useSelector((state: RootState) => state.defaultCommands);
  const dispatch = useAppDispatch();

  const [initialized, setInitialized] = useState<boolean>(!_.isEmpty(selector.commands));

  useEffect(() => {
    if (initialized) return;
    console.log('fetchDefaultCommands');
    loadDefaultCommands().then(res => {
      dispatch(loadConfig(res));
      setInitialized(true);
    }).catch(e => console.log(`error occurred fetching default commands: ${e}`));
  }, [dispatch, initialized]);

  if (initialized) {
    return (<><Body /></>);
  } else {
    return (<>loading...</>);
  }

}

function Body() {

  const selector = useSelector((state: RootState) => state.defaultCommands);

  return (
    <Paper variant='outlined' sx={{ borderRadius: 2 }}>
      {
        Object.entries(selector.commands).map(([key, val]) => (
          <React.Fragment key={key}>
            <CommandItem prefix={key} command={val} />
          </React.Fragment>
        ))
      }
    </Paper>
  );
}

interface CommandItemProps {
  prefix: string,
  command: JsonDefaultCommand,
}

function CommandItem(props: CommandItemProps) {

  const [open, setOpen] = useState<boolean>(false);

  const handleClickSettings = () => {
    setOpen(!open);
  };

  return (
    <Card variant='outlined' sx={{
      borderRadius: 2,
      margin: 1,
    }}>
      <Box sx={{
        display: 'flex',
        direction: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
          <Box component='code' sx={{ margin: 1, width: 96 }}>
            {props.command.prefix}
          </Box>
          <Divider orientation='vertical' flexItem />
          <Box sx={{ margin: 1 }}>
            {getDescription(props.prefix)}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row' }}>
          <CommandEnableSwitch prefix={props.prefix} />
          <Tooltip title='Open Settings'>
            <IconButton onClick={handleClickSettings}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {open && <>
        <Divider />
        <SettingsTray prefix={props.prefix} />
      </>}
    </Card>
  );
}
