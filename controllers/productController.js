import debugLib from 'debug'
import productService from '../services/productService.js';
import jwt from 'jsonwebtoken'
import { secret } from '../config/serverConfig.js';

const debug = debugLib('express0:product:controller');

class ProductController {
    constructor(db) {
        this.db = db;
    }
    getOneOrGetAll = async (req, res) => {
        if (req.query.id) {
            await this.getOneById(req, res, req.query.id);
            return;
        }
        await this.getAll(req, res);
    }

    getAll = async (req, res) => {
        try {
            const data = await this.db.getAll();
            const re =  data
            re.user = req.user
            res.json(re);    
           
        } catch (er) {
            res.status(500).send(er);
        }
    }

    getOne = async (req, res) => {
        await this.getOneById(req, res, req.params.id);
    }

    getOneById = async (req, res, id) => {
        try {
            const re = await this.db.getOne(id);
            re.user = req.user
            res.json(re);
        } catch (er) {
            res.status(500).send(er);
        }
    }

    add = async (req, res, next) => {     
        try {
            const re = await this.db.add(req.body);
            re.user = req.user
            res.status(201).send(re);
        } catch (er) {
            res.status(500).send(er);
        }
    }

    edit = async (req, res, next) => {
        try {

            if (!(req.query.id || req.params.id)) {
                throw {error: 'id is required'};
            }

            // if (!(req.body.login || req.body.password)) {
            //     throw {error: 'body fields "name" or "password" is required'};
            // }

            const id = req.params.id ? req.params.id : req.query.id;
            await this.db.edit(req.body, id)
            const re = await this.db.getOne(id)
            re.user = req.user
            res.status(201).json(re);
        } catch (er) {
            res.status(500).send(er);
        }
    }

    delete = async (req, res, next) => {
        try {
            if (!(req.query.id || req.params.id)) {
                throw {error: 'id is required'};
            }
            const id = req.params.id ? req.params.id : req.query.id;
            await this.db.delete(id);
            res.status(204).send(null);
        } catch (er) {
            //!
            res.status(500).send(er);
        }

    }
}
const productController = new ProductController(productService);
export default productController;