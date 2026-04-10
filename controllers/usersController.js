import debugLib from 'debug'
import userService from '../services/userService.js';

const debug = debugLib('express0:user:controller');

class UsersController {
    constructor(db) {
        this.db = db;
    }
    chekLogin =async (req, res) => {
        try {         
            const re= await this.db.getLogin(req.params.id, req.body.password);
            res.json(re);
        } catch (re) {
            res.status(500).send(er);
        }
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
            const re = await this.db.getAll();
            res.json({status:re.status, data:re.data, user:req.user});
        } catch (er) {
            res.status(500).send(er);
        }
    }

    getOne = async (req, res) => {
        await this.getOneById(req, res, req.params.id);
    }

    getOneById = async (req, res, id) => {
        try {
            let re={} 
            if (id==req.user.id) {
                re = await this.db.getFull(id);
            } else {
                re = await this.db.getOne(id);
            }
            res.json({status:re.status, data:re.data, user:req.user});
        } catch (er) {
            res.status(500).send(er);
        }
    }

    add = async (req, res, next) => {     
        try {
            const re = await this.db.add(req.body);
            res.status(201).json({status:re.status, data:re.data, user:req.user});
        } catch (er) {
            res.status(500).send(er);
        }
    }

    edit = async (req, res, next) => {
        try {

            if (!(req.query.id || req.params.id)) throw {error: 'id is required'};
            const id = req.params.id ? req.params.id : req.query.id;
            if (id!=req.user.id) return res.status(422).send({message:'Не твоё - не тронь!!!'});
            debug (req.body);
            await this.db.edit(req.body, id);
            const re = await this.db.getFull(id);
            res.status(201).json({status:re.status, data:re.data, user:req.user});
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
            if (id!=req.user.id) return res.status(422).send({message:'Не твоё - не тронь!!!'});
            await this.db.delete(id);
            res.status(204).send(null);
        } catch (er) {
            //!
            res.status(500).send(er);
        }

    }

}
const usersController = new UsersController(userService);
export default usersController;