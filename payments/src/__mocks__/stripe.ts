export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({})  // resolved value just to use await
  }
}
