

function Orders({ orders }) {
  const statusColors = {
    "created": "text-info",
    "cancelled": "text-danger",
    "complete": "text-success"
  }


  const orderRows = orders.map(order => 
    <tr key={order.id}>
      <td>{order.ticket.title}</td>
      <td>${order.ticket.price}</td>
      <td><strong className={statusColors[order.status]}>{order.status}</strong></td>
    </tr>
  );

  return (
    <div>
      <h1>Orders</h1>

      <table className='table'>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
            <th>Order Status</th>
          </tr>
        </thead>

        <tbody>
          {orderRows}
        </tbody>
      </table>
    </div>
  )
}


Orders.getInitialProps = async (context, axios) => {
  const { data: orders } = await axios.get('/api/orders');
  return { orders };
}


export default Orders
