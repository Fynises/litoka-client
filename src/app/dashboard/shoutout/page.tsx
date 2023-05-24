'use client';
import * as React from 'react';
import { useState, useEffect, Dispatch } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import authHelper from '@/auth-util/auth-helper';
import ApiShoutoutConfig from './api-shoutout-config';
import BasicPageLoad from '@/util/basic-page-load';
import produce from 'immer';
import _ from 'lodash';
import { ContentCopyOutlined } from '@mui/icons-material';
import { DocumentationLink, IconDocLink, TextDocLink } from '@/util/common-components';

export default function ShoutoutConfig() {

  const [shoutoutConfig, setShoutoutConfig] = useState<ApiShoutoutConfig>();
  const [configIsLoading, setConfigIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ApiShoutoutConfig.getConfig()
      .then(res => {
        setShoutoutConfig(new ApiShoutoutConfig(res));
        setConfigIsLoading(false);
      }).catch(err => console.log(err));
  }, [configIsLoading]);

  if (authHelper.isAuthorized) {
    if (!configIsLoading && shoutoutConfig !== undefined) {
      return (
        <>
          <ShoutoutConfigBody config={shoutoutConfig} />
        </>
      );
    } else {
      return (
        <>
          <BasicPageLoad />
        </>
      );
    }
  } else {
    return (
      <Box sx={{ marginTop: 2 }}>
        <Paper sx={{
          marginTop: 2,
          padding: 2,
          maxWidth: 300,
          margin: 'auto'
        }}>
          <Typography>
            You need to log into twitch to configure the shoutout player
          </Typography>
        </Paper>
      </Box>
    );
  }

}

interface ShoutoutConfigBodyProps {
  config: ApiShoutoutConfig,
}

function ShoutoutConfigBody(props: ShoutoutConfigBodyProps) {

  const [config, setConfig] = useState<ApiShoutoutConfig>(props.config);
  const [shoutoutUri, setShoutoutUri] = useState<string>(
    `${process.env.NEXT_PUBLIC_SHOUTOUT_URL}${props.config.configId}&connectionType=shoutout`
  );

  const handleChangeFilterRange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: number = parseInt(e.target.value);
    if (Number.isNaN(value)) {
      console.log(`${e.target.value} is not a number`);
      value = 0;
    }
    if (value < 0 || value > 300) {
      value = 0; // prevent number from being negative
    }
    const path = 'filterConfig.topViewedRange';
    setConfig(produce(config, draft => _.set(draft, path, value)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shoutoutUri);
  };

  const updateConfig = () => {
    config.sendUpdateConfig()
      .then(() => console.log('to be implemented'))
      .catch(() => console.log('to be implemented'));
  };

  const getNewUri = () => {
    config.getNewShoutoutId()
      .then(res => {
        setConfig(res);
        setShoutoutUri(process.env.NEXT_PUBLIC_SHOUTOUT_URL + res.configId);
      }).catch(() => console.log('unknown error occurred'));
  };

  return (
    <Paper variant='outlined' sx={{ borderRadius: 2 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant='h6' sx={{ margin: 1 }}>
          Shoutout Player Configuration
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <DocumentationLink path='/docs/shoutout-player/introduction' text='documentation' />
          <Button variant='contained' disableElevation={true} size='small' onClick={updateConfig} sx={{
            borderRadius: 4,
            marginRight: 2
          }}>
            Save Settings
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <Typography variant='body1' sx={{ margin: 1 }}>
            Link
          </Typography>
          <Divider />
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 1
          }}>
            <Tooltip title='Copy to Clipboard'>
              <IconButton onClick={() => copyToClipboard()}>
                <ContentCopyOutlined />
              </IconButton>
            </Tooltip>
            <TextField InputProps={{ readOnly: true }}
              size='small'
              value={shoutoutUri}
            />
            <Button variant='contained' disableElevation={true} size='small' onClick={getNewUri} sx={{
              marginLeft: 1,
              borderRadius: 4,
              fontFamily: 'Roboto'
            }}>
              Get new link
            </Button>
            <Box sx={{ marginLeft: 2 }}>
              <TextDocLink path='/docs/shoutout-player/introduction#obs-browser-source-url' text={
                'Check documentation for recommendations'
              } />
            </Box>
          </Box>
        </Card>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <Typography variant='body1' sx={{ margin: 1 }}>
            Settings
          </Typography>
          <Divider />
          <FormGroup>
            <FormSwitch id='settings.enableAutoShoutout' config={config} setConfig={setConfig}>
              Enable automatic shoutout on channel raid
            </FormSwitch>
            <Divider />
            <FormSwitch id='settings.enableChatResponse' config={config} setConfig={setConfig}>
              Enable chat response
            </FormSwitch>
            <Divider />
            <FormSwitch id='settings.defaultMute' config={config} setConfig={setConfig}>
              Default clip muted
            </FormSwitch>
            <Divider />
          </FormGroup>
          <ShoutoutModeSelector config={config} setConfig={setConfig} />
          <Divider />
          <FormGroup>
            <FormSwitch id='settings.useMaxClipDuration' config={config} setConfig={setConfig}>
              Use max clip duration
            </FormSwitch>
          </FormGroup>
          <Divider />
          <AdditionalConfigTimers id='maxClipDuration' label='Max Clip Duration' config={config} setConfig={setConfig} />
          <Divider />
          <AdditionalConfigTimers id='clipEndDelay' label='Clip End Delay' config={config} setConfig={setConfig} />
          <Divider />
          <AdditionalConfigTimers id='nameDuration' label='Name Only Duration' config={config} setConfig={setConfig} />
        </Card>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <Typography variant='body1' sx={{ margin: 1 }}>
            Filter settings
          </Typography>
          <Divider />
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 1
          }}>
            <Typography>
              Top Viewed
            </Typography>
            <TextField size='small' type='number' label='range' sx={{ marginLeft: 1, width: 96 }}
              value={config.filterConfig.topViewedRange}
              onChange={e => handleChangeFilterRange(e)}
            />
          </Box>
        </Card>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant='body1' sx={{ margin: 1 }}>
              Override Settings
            </Typography>
            <IconDocLink path='/docs/shoutout-player/overrides' />
          </Box>
          <Divider />
          <FormSwitch id='overrideConfig.clip' config={config} setConfig={setConfig}>
            -c : Use Clip
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.clipMuted' config={config} setConfig={setConfig}>
            -cm : Use Clip (force muted)
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.clipUnmuted' config={config} setConfig={setConfig}>
            -cu : Use Clip (force unmuted)
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.nameOnly' config={config} setConfig={setConfig}>
            -n : Use Name only
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.messageOnly' config={config} setConfig={setConfig}>
            -m : Use Message Only
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.directClip' config={config} setConfig={setConfig}>
            -d : Use direct clip shoutout
          </FormSwitch>
        </Card>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <ShoutoutTester config={config} />
        </Card>
      </Box>
    </Paper>
  );
}

interface ModeSelectorProps {
  config: ApiShoutoutConfig,
  setConfig: Dispatch<ApiShoutoutConfig>,
}

function ShoutoutModeSelector(props: ModeSelectorProps) {
  const handleChangeMode = (_e: React.MouseEvent<HTMLElement, MouseEvent>, val: string) => {
    const path = 'settings.shoutoutMode';
    props.setConfig(produce(props.config, draft => _.set(draft, path, val)));
  };

  return (
    <Box sx={{ margin: 1, display: 'flex', direction: 'row', alignItems: 'center' }}>
      <Box>
        <ToggleButtonGroup
          size='small'
          color='primary'
          value={props.config.settings.shoutoutMode}
          exclusive
          onChange={handleChangeMode}
        >
          <ToggleButton value='clip'>Clip</ToggleButton>
          <ToggleButton value='name_only'>Name Only</ToggleButton>
          <ToggleButton value='message_only'>Message Only</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Typography sx={{ marginLeft: '2' }}>
          Select Mode
        </Typography>
      </Box>
    </Box>
  );
}

interface FormSwitchProps {
  id: string,
  config: ApiShoutoutConfig,
  setConfig: Dispatch<ApiShoutoutConfig>,
  children?: React.ReactNode,
}

function FormSwitch(props: FormSwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    props.setConfig(produce(props.config, draft => _.set(draft, props.id, checked)));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', marginLeft: 2 }}>
      <FormControlLabel label={undefined}
        control={<Switch id={props.id} checked={_.get(props.config, props.id) as boolean} onChange={(e) => handleChange(e)} />}
      />
      <Box>{props.children}</Box>
    </Box>
  );
}

interface DelayProps {
  id: string,
  label: string,
  config: ApiShoutoutConfig,
  setConfig: Dispatch<ApiShoutoutConfig>,
}

function AdditionalConfigTimers(props: DelayProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: number = parseInt(e.target.value);
    if (Number.isNaN(value)) {
      console.log(`${e.target.value} is not a number`);
      value = 0;
    }
    if (value < 0) {
      value = 0;
    }
    const path = `settings.${props.id}`;
    props.setConfig(produce(props.config, draft => _.set(draft, path, Math.floor(value))));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', margin: 1 }}>
      <TextField sx={{ width: 96 }}
        size='small'
        type='number'
        label='milliseconds'
        value={_.get(props.config, `settings.${props.id}`, 0)}
        onChange={e => handleChange(e)}
      />
      <Typography sx={{ marginLeft: 2 }}>
        {`${props.label} (${_.get(props.config, `settings.${props.id}`, 0) / 1000} seconds)`}
      </Typography>
    </Box>
  );
}

interface ShoutoutTesterProps {
  config: ApiShoutoutConfig,
}

function ShoutoutTester(props: ShoutoutTesterProps) {
  const [body, setBody] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleSubmit = () => {
    props.config.sendTestShoutout(body)
      .then(() => console.log('to be implemented'))
      .catch(() => console.log('to be implemented'));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', margin: 1 }}>
      <TextField sx={{ width: 400 }}
        size='small'
        label='shoutout body'
        value={body}
        onChange={e => handleChange(e)}
      />
      <Button sx={{ borderRadius: 4, marginLeft: 2 }}
        variant='contained'
        disableElevation={true}
        size='small'
        onClick={handleSubmit}
      >
        send test shoutout
      </Button>
    </Box>
  );
}
