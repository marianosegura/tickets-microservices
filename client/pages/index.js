import Link from 'next/link';


function Index({ currentUser, tickets }) {
  const ticketRows = tickets.map(ticket => 
    <tr key={ticket.id}>
      <td>
        <Link 
          href={'/tickets/[ticketId]'} 
          as={`/tickets/${ticket.id}`}
        >
          <a>{ticket.title}</a>
        </Link>
      </td>
      <td>${ticket.price}</td>
    </tr>
  );

  return (
    <div>
      <h1>Tickets</h1>

      <table className='table'>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {ticketRows}
        </tbody>
      </table>
    </div>
  )
}

Index.getInitialProps = async (context, axios, currentUser) => {  
  const { data: tickets } = await axios.get('/api/tickets');
  return { tickets };
}



export default Index;
