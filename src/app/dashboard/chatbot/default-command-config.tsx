import * as React from 'react';
import { useState, useEffect, useContext, Dispatch } from 'react';
import { ApiDefaultCommands, DefaultCommand } from './default-commands';
import { ChatBotContext } from './chatbot-context';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import produce from 'immer';
import _ from 'lodash';

export default function DefaultCommandConfig() {

  const context = useContext(ChatBotContext);
  if (!context) throw new Error('context not found');
  const [initialized, setInitialized] = useState<boolean>(context.defaultCommands !== undefined);

  useEffect(() => {
    if (initialized) return;
    console.log('fetchDefaultCommands');
    ApiDefaultCommands.getDefaultCommands()
      .then(data => {
        context.setDefaultCommands(new ApiDefaultCommands(data));
        setInitialized(true);
      }).catch(() => console.log('todo: handle error'));
  }, [context, initialized]);

  if (context.defaultCommands !== undefined) {
    return (
      <>
        <Body defaultCommands={context.defaultCommands} setDefaultCommands={context.setDefaultCommands} />
      </>
    );
  } else {
    return (<>loading...</>);
  }

}

interface DefaultCommandConfigBodyProps {
  defaultCommands: ApiDefaultCommands,
  setDefaultCommands: Dispatch<ApiDefaultCommands>,
}

function Body(props: DefaultCommandConfigBodyProps) {
  return (
    <Paper variant='outlined' sx={{ borderRadius: 2 }}>
      {props.defaultCommands.default_commands.map((element, i) => <>
        <CommandItem
          index={i}
          command={element}
          setDefaultCommand={props.setDefaultCommands}
        />
      </>)}
    </Paper>
  );
}

interface CommandItemProps {
  index: number,
  command: DefaultCommand,
  setDefaultCommand: Dispatch<ApiDefaultCommands>,
}

function CommandItem(props: CommandItemProps) {

  //const theme = useTheme();
  const [command, setCommand] = useState<DefaultCommand>(new DefaultCommand(props.command));
  const [open, setOpen] = useState<boolean>(false);

  const setEnabled = (checked: boolean) => {
    setCommand(produce(command, draft => _.set(draft, 'enabled', checked)));
  };

  const handleChangeEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const oldChecked = !newChecked;
    console.log(`check enable: ${newChecked}`);
    setEnabled(newChecked);
    command.updateToggle(newChecked)
      .then(() => console.log('todo'))
      .catch(() => setEnabled(oldChecked));
    //props.setDefaultCommand(produce(props.command, draft => _.set(draft, `[${props.index}].enabled`, checked)));
  };

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
          <Box component='code' sx={{
            margin: 1,
            width: 96
          }}>
            {props.command.prefix}
          </Box>
          <Divider orientation='vertical' flexItem />
          <Box sx={{ margin: 1 }}>
            {command.getDescription()}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row' }}>
          <Tooltip title='toggle'>
            <FormControlLabel label={undefined}
              control={<Switch checked={command.enabled} onChange={(e) => handleChangeEnable(e)} />}
            />
          </Tooltip>
          <Tooltip title='Open Settings'>
            <IconButton onClick={handleClickSettings}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {open && <>
        <Divider />
        <SettingsTray command={command} setCommand={setCommand} />
      </>}
    </Card>
  );
}

interface SettingsTrayProps {
  command: DefaultCommand,
  setCommand: Dispatch<DefaultCommand>,
}

function SettingsTray(props: SettingsTrayProps) {

  const handleClickSubmit = () => {
    props.command.updateCommand()
      .then(() => console.log('todo'))
      .catch(err => console.log(`default command clicksubmit error ${err}`));
  };

  return (
    <Box sx={{ margin: 1, marginLeft: 2 }}>
      <Card variant='outlined' sx={{ borderRadius: 2 }}>
        <Typography variant='body1' sx={{ margin: 1 }}>Permissions</Typography>
        <Divider />
        <GroupSelector identifier='moderator'
          label='Moderators'
          command={props.command}
          setCommand={props.setCommand}
        />
        <Divider />
        <GroupSelector identifier='vip'
          label='VIPs'
          command={props.command}
          setCommand={props.setCommand}
        />
        <Divider />
        <GroupSelector identifier='subscriber'
          label='Subscribers'
          command={props.command}
          setCommand={props.setCommand}
        />
        <Divider />
        <GroupSelector identifier='everyone'
          label='Everyone'
          command={props.command}
          setCommand={props.setCommand}
        />
      </Card>
      <Button variant='contained' disableElevation={true} size='small' onClick={handleClickSubmit} sx={{
        borderRadius: 4,
        marginTop: 1
      }}>
        update
      </Button>
    </Box>
  );
}

interface GroupSelectorProps {
  identifier: string,
  label: string,
  command: DefaultCommand,
  setCommand: Dispatch<DefaultCommand>,
}

function GroupSelector(props: GroupSelectorProps) {

  const enabledField = `access.${props.identifier}.enabled`;
  const durationField = `access.${props.identifier}.duration`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    props.setCommand(produce(props.command, draft => _.set(draft, enabledField, checked)));
  };

  const handleChangeCooldown = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: number = parseInt(e.target.value);
    if (Number.isNaN(value) || value < 5) {
      value = 5;
    }
    props.setCommand(produce(props.command, draft => _.set(draft, durationField, Math.floor(value))));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', marginY: 1, marginRight: 1 }}>
      <FormControlLabel label={props.label} sx={{ marginLeft: 0.5, width: 152 }}
        control={<Switch id={props.identifier}
          checked={_.get(props.command, enabledField)}
          onChange={(e) => handleChange(e)} />}
      />
      <TextField
        size='small'
        type='number'
        label='cooldown in seconds'
        value={_.get(props.command, durationField)}
        onChange={(e) => handleChangeCooldown(e)}
      />
    </Box>
  );
}
