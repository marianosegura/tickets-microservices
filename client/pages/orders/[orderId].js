import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';


function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);  // seconds
  useEffect(() => {
    function updateTimeLeft() {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft/1000));  
    }
    
    updateTimeLeft();  // call once at the start to set initial time
    const timeLeftTimer = setInterval(updateTimeLeft, 1000);

    return () => {  // clear interval when exiting
      clearInterval(timeLeftTimer);
    }
  }, []);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },  // token is passed to the doRequest function (later merged)
    onSuccess: (payment) => Router.push('/orders')
  });


  if (timeLeft < 0) {
    return <h1>Order Expired</h1>
  }
  return (
    <>
      <h2>Ticket: {order.ticket.title}</h2>
      <p>Time left to pay: <strong>{timeLeft}s</strong></p>
      
      <br />
      <StripeCheckout
        token={(token) => doRequest({ token: token.id})}
        stripeKey="pk_test_51LDYi9Fnt7wiLbG8z46ggGoiOoxbA3Mfih3sJQlxu9VtGV7Rc4epUMMkbfOBheieSHUPEHmKrfFNdBEnnHDDnabQ00rPQSEgOC"
        amount={order.ticket.price*100}  // dollares -> cents
        email={currentUser.email}
      />
      {errors}
    </>    
  )
}


OrderShow.getInitialProps = async (context, axios) => {
  const { orderId } = context.query;
  const { data: order } = await axios.get(`/api/orders/${orderId}`);
  return { order };
}


export default OrderShow
