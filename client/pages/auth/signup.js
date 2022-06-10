import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';


export default () => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('asdf');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  }

  return (
    <form className='p-2' onSubmit={onSubmit}>
      <h1>Sign Up</h1>

      <div className="form-group">
        <label>Email Address</label>
        <input 
          className="form-control" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input 
          type="password" 
          className="form-control" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}
