import express from 'express';


const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;  // destroy session 
  res.send({});
});


export { router as signoutRouter };
