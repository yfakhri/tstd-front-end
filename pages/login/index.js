import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { signIn, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    height: '1px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  hf: {
    height: '20%',
  },
}));

export default function Login({ session }) {
  const classes = useStyles();
  const router = useRouter();
  useEffect(() => {
    if (session && !session.error) {
      router.push('/');
    }
  });
  if (session && !session.error) {
    return <div></div>;
  }
  return (
    <Grid container component="main" justify="center" className={classes.root}>
      <Grid item xs={false} sm={12}></Grid>
      <Grid item component={Paper} xs={12} sm={4}>
        <div className={classes.paper}>
          {session && session.error && (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={true}
              autoHideDuration={6000}
              message="INTERNAL SERVER ERROR"
            />
          )}

          <Typography component="h1" variant="h5">
            Tstudy Depilkom UPI
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              event.preventDefault();
              signIn('google', { callbackUrl: '/' });
            }}
            fullWidth
            className={classes.submit}
          >
            Sign in with Google
          </Button>
        </div>
      </Grid>
      <Grid item xs={false} sm={12}></Grid>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
