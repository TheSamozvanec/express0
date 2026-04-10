import express from 'express' // роутер
import productController from '../controllers/productController.js';
import debugLib from 'debug'

const debug = debugLib('express0:product');
const productRouter = express.Router();

productRouter.get('/', productController.getOneOrGetAll);
productRouter.get('/:id', productController.getOne);
productRouter.post('/', productController.add);
productRouter.patch('/', productController.edit);
productRouter.patch('/:id', productController.edit);
productRouter.delete('/', productController.delete);
productRouter.delete('/:id', productController.delete);

export default productRouter;
