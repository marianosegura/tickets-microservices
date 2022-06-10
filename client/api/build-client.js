import axios from 'axios';


// build axios considering if code is running on the browser or the server 
const buildClient = ({ req }) => {
  const inBrowser = typeof window !== 'undefined';
  if (inBrowser) {
    console.log('browser!');
    return axios.create({ baseURL: '/' });  // no config needed 
  } else {
    console.log('server!');
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  }
}


export default buildClient;
