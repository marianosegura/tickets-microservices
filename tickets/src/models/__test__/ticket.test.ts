import { Ticket } from '../ticket';


it('fails to save a document with an outdated version', async (done) => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });
  await ticket.save();

  // fetch ticket twice
  const instance1 = await Ticket.findById(ticket.id);
  const instance2 = await Ticket.findById(ticket.id);

  // update first ticket
  instance1!.set({ price: 1 });
  await instance1!.save();
  
  // try to update the second ticket (outdated version number)
  instance2!.set({ price: 2 });

  try {
    await instance2!.save();
  } catch (error) {
    return done();  // ok
  }

  throw new Error('Test failed');
});


it('increments the version number on save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  
  await ticket.save();
  expect(ticket.version).toEqual(1);
  
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
