'use client';
import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  FormGroup,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ContentCopyOutlined } from '@mui/icons-material';
import { DocumentationLink, IconDocLink, TextDocLink } from '@/util/common-components';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/redux-store/store';
import FormSwitch from './form-switch';
import { ShoutoutModeSelector } from './toggle-button-groups';
import MillisecondSelector from './millisecond-selector';
import ShoutoutTester from './shoutout-tester';
import { getNewShoutoutId, sendUpdateConfigV2 } from './new-config-api';
import { setConfigField, update } from '@/redux-store/models/shoutout-config';
import { useSnackbar } from 'notistack';

export function ShoutoutConfigBody() {

  const selector = useSelector((state: RootState) => state.shoutoutConfig);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [shoutoutUri, setShoutoutUri] = useState<string>(
    `${process.env.NEXT_PUBLIC_SHOUTOUT_URL}${selector.data?.configId}&connectionType=shoutout`
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
    dispatch(setConfigField({ key: path, value: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shoutoutUri);
  };

  const updateConfig = () => {
    if (selector.data !== null) {
      sendUpdateConfigV2({ changes: selector.changes })
        .then(() => {
          dispatch(update());
          enqueueSnackbar('Successfully updated config', { variant: 'success' });
        })
        .catch(e => {
          console.log(`error updating config: ${e}`);
          enqueueSnackbar('error updating config', { variant: 'error' });
        });
    } else {
      console.log('config has not been initialised');
    }
  };

  const getNewUri = () => {
    getNewShoutoutId()
      .then(res => setShoutoutUri(process.env.NEXT_PUBLIC_SHOUTOUT_URL + res))
      .catch(e => console.log(`error occurred updating shoutout uri: ${e}`));
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
            <FormSwitch id='settings.enableAutoShoutout'>
              Enable automatic shoutout on channel raid
            </FormSwitch>
            <Divider />
            <FormSwitch id='settings.enableChatResponse'>
              Enable chat response
            </FormSwitch>
            <Divider />
            <FormSwitch id='settings.defaultMute'>
              Default clip muted
            </FormSwitch>
            <Divider />
          </FormGroup>
          <ShoutoutModeSelector />
          <Divider />
          <FormGroup>
            <FormSwitch id='settings.useMaxClipDuration'>
              Use max clip duration
            </FormSwitch>
          </FormGroup>
          <Divider />
          <MillisecondSelector id='settings.maxClipDuration' label='Max Clip Duration' />
          <Divider />
          <MillisecondSelector id='settings.clipEndDelay' label='Clip End Delay' />
          <Divider />
          <MillisecondSelector id='settings.nameDuration' label='Name Only Duration' />
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
              value={selector.data?.filterConfig.topViewedRange}
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
          <FormSwitch id='overrideConfig.clip'>
            -c : Use Clip
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.clipMuted'>
            -cm : Use Clip (force muted)
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.clipUnmuted'>
            -cu : Use Clip (force unmuted)
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.nameOnly'>
            -n : Use Name only
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.messageOnly'>
            -m : Use Message Only
          </FormSwitch>
          <Divider />
          <FormSwitch id='overrideConfig.directClip'>
            -d : Use direct clip shoutout
          </FormSwitch>
        </Card>
      </Box>
      <Box sx={{ margin: 1 }}>
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
          <ShoutoutTester />
        </Card>
      </Box>
    </Paper>
  );
}
