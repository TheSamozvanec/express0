import express from 'express' // роутер
import usersController from '../controllers/usersController.js';
import debugLib from 'debug'

const debug = debugLib('express0:user');
const usersRouter = express.Router();

usersRouter.get('/', usersController.getOneOrGetAll);
usersRouter.get('/:id', usersController.getOne);
usersRouter.post('/', usersController.add);
usersRouter.put('/', usersController.edit);
usersRouter.put('/:id', usersController.edit);
usersRouter.patch('/', usersController.edit);
usersRouter.patch('/:id', usersController.edit);
usersRouter.delete('/', usersController.delete);
usersRouter.delete('/:id', usersController.delete);
usersRouter.post('/login/:id', usersController.chekLogin);

export default usersRouter;
