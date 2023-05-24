'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  VideoChat as VideoChatIcon,
  VideoSettings as VideoSettingsIcon
} from '@mui/icons-material';

export default function MenuList() {
  return (
    <>
      <List>
        <MenuListItem
          title='Home'
          route='/dashboard'
          icon={<HomeIcon />}
        />
        <MenuListItem
          title='Chat Bot'
          route='/dashboard/chat-bot'
          icon={<ChatIcon />}
        />
        <MenuListItem
          title='Shoutout Player'
          route='/dashboard/shoutout'
          icon={<VideoChatIcon />}
        />
        <MenuListItem
          title='Clip Player'
          route='/dashboard/clip-player'
          icon={<VideoSettingsIcon />}
        />
      </List>
    </>
  );
}

interface MenuListItemProps {
  title: string,
  route: string,
  icon?: React.ReactNode,
}

const buttonHoverColor = '#008252';

function MenuListItem(props: MenuListItemProps) {

  const router = useRouter();
  const handleClick = () => router.push(props.route);

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{
        ':hover': {
          bgcolor: buttonHoverColor
        }
      }}>
        <ListItemIcon sx={{ color: 'white' }}>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.title} />
      </ListItemButton>
    </>
  );

}
