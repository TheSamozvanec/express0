//import { sequelPG } from "../modules/dbCFG.js"
import debugLib from 'debug'

const debug = debugLib('express0:user:controller');

export default class UsersController {
    constructor (db) {
        this.db=db
    }
    getAll = async (req, res)=>{
        try {
            let result;
            if (req.query.id){
                result= await this.#getone(req.query.id)
            } else {
                result = await this.#getall()
            } 
            res.render('user',{title:'Юзеры', result});
        } catch(error){           
            res.status(400).render('error400',{title:error.error,message:error.message, ret:'/'})
        }       
    }
    getOne = async (req, res)=>{
        debug(`id(0):${req.params.id}`)
        try {
        let result= await this.#getone(req.params.id)
            res.json(result)
        } catch (error){
            res.status(400).json(error)
        }
    }
    #getall = async ()=>{
        try {
            let [result] = await this.db.query('SELECT name, surname, id_user FROM users;');
            return result
         } catch (error) {
            throw error
         }
    }
    #getone = async (id)=>{
        try {
            debug(`id(1):${id}`)
            let [result] = await this.db.query(`
                SELECT name, surname, id_user 
                FROM users 
                WHERE id_user=${id};
                `);
            if (result.length<1) throw {error:'query error', message:'Такого id не существует!'}
            debug(`lenrth:${result.length}`)
            return result
        } catch (error) {
            debug(error)
            throw error
        }
    }
   
}


