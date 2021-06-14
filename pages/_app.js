import '../styles/globals.css';
import '@fontsource/roboto';
import Head from 'next/head';
import { Provider } from 'next-auth/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <StylesProvider injectFirst={true}>
        <CssBaseline />
        <Head>
          <title>Tstudy</title>
          <meta
            name="description"
            content="Tracer Study Departemen Ilmu Komputer UPI"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </StylesProvider>
    </Provider>
  );
}

export default MyApp;
