import useRequest from "../../hooks/use-request";
import Router from 'next/router';


function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  return (
    <>
      <h1>{ticket.title}</h1>
      <h4>Price: <span className='font-weight-normal'>${ticket.price}</span></h4>
      {errors}
      <button className='btn btn-primary' onClick={() => doRequest()}>Purchase</button>
    </>
  )
}


TicketShow.getInitialProps = async (context, axios) => {
  const { ticketId } = context.query;
  const { data: ticket } = await axios.get(`/api/tickets/${ticketId}`);
  return { ticket };
}


export default TicketShow
