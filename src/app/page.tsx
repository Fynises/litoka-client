'use client';
import * as React from 'react';
import { Box, Container } from '@mui/system';
import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material';

const secondaryColor = '#006342';
const topBackgroundColor = '#004A31';

export default function Home() {

  const handleClick = () => {
    console.log('todo: handleClick');
  };

  return (
    <>
      <Box sx={{
        height: 460,
        backgroundColor: topBackgroundColor
      }}>
        <Container maxWidth='lg' sx={{ paddingTop: 4 }}>
          <Box sx={{
            display: 'flex',
            height: 72,
            backgroundColor: secondaryColor,
            borderRadius: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Box>
              <Typography>info bar placeholder</Typography>
            </Box>
          </Box>
          <Box sx={{ width: '40%' }}>
            <Typography variant='h2' color='white' sx={{ paddingTop: 2 }}>
              {`The open source twitch streaming suite ${process.env.NEXT_PUBLIC_CLIENT_ENV_TEST}`}
            </Typography>
            <Card elevation={0} sx={{
              display: 'flex',
              backgroundColor: secondaryColor,
              margin: 3,
              width: 256,
              height: 48,
              color: 'white',
              borderRadius: '24px',
              alignItems: 'center',
              justifyContent: 'center',
              border: 1,
              borderColor: '#00B075'
            }}>
              <CardActionArea onClick={handleClick}>
                <CardContent>
                  <Typography variant='body1'>
                    Sign in with twitch
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Container>
      </Box>
      <FeaturesSection />
      <PageFooter />
    </>
  );
}

function FeaturesSection() {
  return (
    <Box sx={{ height: 400 }}>
      <Container maxWidth='lg' sx={{ paddingTop: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant='h3' sx={{
            borderBottom: 4,
            borderBottomColor: topBackgroundColor,
            paddingX: 3,
          }}>
            Features
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'space-evenly',
          marginTop: 3
        }}>
          <FeaturesItem title='test1' description='test1' />
          <FeaturesItem title='test2' description='test2' />
          <FeaturesItem title='test3' description='test3' />
        </Box>
      </Container>
    </Box>
  );
}

interface FeaturesItemProps {
  title: string,
  description: string,
}

function FeaturesItem(props: FeaturesItemProps) {
  return (
    <Card elevation={0} sx={{
      width: 224,
      height: 224,
      borderRadius: 4,
      backgroundColor: '#f5f5f5',
      border: 1,
      borderColor: topBackgroundColor
    }}>
      <CardHeader title={props.title} sx={{ textAlign: 'center' }} />
      <CardContent>
        <Typography>{props.description}</Typography>
      </CardContent>
    </Card>
  );
}

function PageFooter() {
  return (
    <Box sx={{ height: 200, backgroundColor: '#404040' }}></Box>
  );
}
