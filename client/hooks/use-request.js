import axios from 'axios';
import { useState } from 'react';

// hook to handle request errors
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    setErrors(null);
    try {
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);  // success callback
      }

      return response.data;
    } catch (err) {
      setErrors(  // set errors as jsx
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map(error => 
              <li key={error.message}>{error.message}</li>  
            )}
          </ul>
        </div>
      );
    }
  }

  return { doRequest, errors };
};
