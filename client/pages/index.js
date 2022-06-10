import buildClient from "../api/build-client";


const Index = ({ currentUser }) => {
  let message = currentUser ? 'You are signed in' : 'You are NOT signed in';
  return (
    <h1>{message}</h1>
  )
}

Index.getInitialProps = async (context) => {  
  const axios = buildClient(context);  // get axios configured for server or browser
  const { data } = await axios.get('/api/users/currentuser');
  return data;
}



export default Index;
