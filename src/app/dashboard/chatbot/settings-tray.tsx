'use client';
import * as React from 'react';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { Box, Card, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { updateConfigField } from '@/redux-store/models/chatbot-default-config';

type TrayProps = {
  prefix: string;
};

export default function SettingsTray(props: TrayProps) {
  return (
    <Box sx={{ margin: 1, marginLeft: 2 }}>
      <Card variant='outlined' sx={{ borderRadius: 2 }}>
        <Typography variant='body1' sx={{ margin: 1 }}>
          Permissions
        </Typography>
        <Divider />
        <GroupSelector identifier='moderator'
          label='Moderators'
          prefix={props.prefix}
        />
        <Divider />
        <GroupSelector identifier='vip'
          label='VIPs'
          prefix={props.prefix}
        />
        <Divider />
        <GroupSelector identifier='subscriber'
          label='Subscribers'
          prefix={props.prefix}
        />
        <Divider />
        <GroupSelector identifier='everyone'
          label='Everyone'
          prefix={props.prefix}
        />
      </Card>
    </Box>
  );
}

type GroupSelectorProps = {
  prefix: string;
  identifier: string;
  label: string;
};

function GroupSelector(props: GroupSelectorProps) {

  const selector = useSelector((state: RootState) => state.defaultCommands);
  const dispatch = useAppDispatch();

  const handleChangeEnable = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateConfigField({
      prefix: props.prefix,
      key: `access.${props.identifier}.enabled`,
      value: e.target.checked
    }));
  };

  const handleChangeCooldown = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: number = parseInt(e.target.value);
    if (Number.isNaN(value) || value < 5) value = 5;
    dispatch(updateConfigField({
      prefix: props.prefix,
      key: `access.${props.identifier}.duration`,
      value: value
    }));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', marginY: 1, marginRight: 1 }}>
      <FormControlLabel label={props.label} sx={{ marginLeft: 0.5, width: 152 }}
        control={<Switch
          id={props.identifier}
          checked={_.get(selector.commands[props.prefix].access, `${props.identifier}.enabled`)}
          onChange={(e) => handleChangeEnable(e)}
        />}
      />
      <TextField
        size='small'
        type='number'
        label='cooldown in seconds'
        value={_.get(selector.commands[props.prefix].access, `${props.identifier}.duration`)}
        onChange={(e) => handleChangeCooldown(e)}
      />
    </Box>
  );
}
