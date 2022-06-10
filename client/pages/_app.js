import 'bootstrap/dist/css/bootstrap.css';  // make bootstrap available in all components
import buildClient from '../api/build-client';
import Header from '../components/header';


// like a component middleware
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps}/>
    </>
  )
};


AppComponent.getInitialProps = async (appContext) => {  // executed first in the server, then on the client upon navigation
  const context = appContext.ctx;  // normal component context is nested since we are in the custom component file
  const axios = buildClient(context);  // get axios configured for server or browser
  const { data } = await axios.get('/api/users/currentuser');
  
  let pageProps;  // call component getInitialProps (like Index's)
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(context);
  }

  return {
    pageProps,
    ...data
  };
}

export default AppComponent;
