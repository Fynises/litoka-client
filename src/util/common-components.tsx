import * as React from 'react';
import docHelper from './doc-helper';
import { Button, IconButton, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

interface DocumentationLinkProps {
  path: string,
  text: string,
}

export function DocumentationLink(props: DocumentationLinkProps) {
  return (
    <>
      <a href={docHelper.make(props.path)} target='_blank' rel='noopener noreferrer'>
        <Button variant='contained' disableElevation={true} size='small' sx={{
          borderRadius: 4,
          marginRight: 2
        }}>
          {props.text}
        </Button>
      </a>
    </>
  );
}

interface IconDocLinkProps {
  path: string,
}

export function IconDocLink(props: IconDocLinkProps) {
  return (
    <>
      <Tooltip title='view documentation'>
        <a href={docHelper.make(props.path)} target='_blank' rel='noopener noreferrer'>
          <IconButton>
            <HelpIcon />
          </IconButton>
        </a>
      </Tooltip>
    </>
  );
}

export function TextDocLink(props: DocumentationLinkProps) {
  return (
    <>
      <a href={docHelper.make(props.path)} target='_blank' rel='noopener noreferrer'>
        {props.text}
      </a>
    </>
  );
}
