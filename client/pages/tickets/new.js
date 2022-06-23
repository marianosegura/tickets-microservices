import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";


function New() {
  const [title, setTitle] = useState('ticket #1');
  const [price, setPrice] = useState(1);
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/')
  });

  function onBlur() {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) return;  // let backend handle price type failure
    setPrice(parsedPrice.toFixed(2));
  }

  function obSubmit(event) {
    event.preventDefault();
    doRequest();
  }

  return (
    <div>
      <h1>Create a Ticket</h1>

      <form onSubmit={obSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input 
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div className='form-group'>
          <label>Price ($)</label>
          <input 
            className='form-control'
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)} 
          />
        </div>

        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default New
