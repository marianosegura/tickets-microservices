export const natsSingleton = {  // mock class instance 
  client: {
    publish: jest.fn().mockImplementation(  // function wrapper to make tests (like if it ran)
      (subject: string, data: string, callback: ()=>void) => {
        callback();
      }
    )
  }
};