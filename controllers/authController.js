import debugLib from 'debug'
import userService from '../services/userService.js'
import jwt from 'jsonwebtoken'
import { jwtExpires, secret } from '../config/serverConfig.js';
import bcrypt from 'bcrypt';
import { parseExpiresIn } from '../config/functions.js';

const debug = debugLib('express0:auth:controller');
const salt = 10; // глубина криптования пароля


class AuthController {
    constructor(db) {
        this.db = db;
    }
    signIn = async (req, res) => {
        const {login, password} = req.body
        const found = await this.db.chekLogin(login);
        if (!found) return res.status(401).json({message:'Иди нахуй!!!'});
        const passwordHash = found.password;
        const isValid = await bcrypt.compare(password, passwordHash);
        if (!isValid) return res.status(401).json({message:'Пиздишь!!!'});
        debug('time>>>',jwtExpires);
        debug('ms>>> ',parseExpiresIn(jwtExpires));
        const payload=found.dataValues;
        delete payload.password
        const token = jwt.sign({payload}, secret, {expiresIn:jwtExpires});
        //отдаем куку - токен
        res.cookie('token', token, {
        httpOnly: true,   // Защита от XSS
        secure: false,     // НЕ Только HTTPS
        sameSite: 'strict', // Защита от CSRF
        maxAge: parseExpiresIn(jwtExpires)   // парсер
        });
        // отдаем токен 
        res.send({login, auth:'success'});
    }

    createNew = async (req, res, next) => {
        if (!req.body) return res.status(400).json({message:`Кривопись непотребная!!!`});
        const {login, password} = req.body;
        if (!login) return res.status(400).json({message:'А зваться как будешь? (login)'});
        if (!password) return res.status(400).json({message:'А тайну какую хронишь? (password)'}); 
        const isUser = await this.db.chekLogin(login);
        if (isUser) return res.status(422).json({message:`Врешь поскуда!!! Я ${isUser.login} знаю и тайну он мне свою поведал!!!`});
        const passwordHash = await bcrypt.hash(password,salt);
        debug (`hash>>>>>>>>>${passwordHash}`);
        const newUser = await this.db.add({login,password:passwordHash,comment:password});
        const {id, login:log} = newUser.data
        res.json({id, login:log});
    }

    check = async (req, res, next) => {
        res.json({user:req.user});
    }

    logaut = async (req, res, next) => {
        res.clearCookie('token');
        res.status(204).send();
    }
}
const authController = new AuthController(userService);
export default authController;