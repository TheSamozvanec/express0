import express from 'express' // роутер
import authController from '../controllers/authController.js';
import debugLib from 'debug'

const debug = debugLib('express0:auth');
const authRouter = express.Router();

authRouter.post('/sign-in', authController.signIn);
authRouter.post('/create-new', authController.createNew);
authRouter.get('/chek',authController.check);
authRouter.get('/logaut',authController.logaut);

export default authRouter;
