import debugLib from 'debug'
import jwt from 'jsonwebtoken'
import { secret } from '../config/serverConfig.js';

const debug = debugLib('express0:auth:mdidleware');

export function authMiddleware(whhiteList){

    return (req,res,next) => {
        try {
            const path = req.path
            debug (path);
            debug ('Белый лист:')
            debug (whhiteList);
            if (whhiteList.some(rout=>rout===path)) return next(); // если из белого листа - без авторизации проходит
            const token = req.cookies.token;
            if (!token) return res.status(401).json({message:'Пошел нахуй!!!'}) 
            const auth=jwt.verify(token,secret, (error,decoded)=> {
                        const payload ={}
                        if(decoded) Object.assign(payload,decoded.payload)
                        return {error, payload}
                    });
            if (auth.error) throw error;
            debug (auth);
            req.user = auth.payload
            next();
        } catch (err) {
            const error = JSON.stringify(err)
            debug(err)
            res.status(401).send({
                message:'Пошел нахуй!!!', 
                error: {
                    message: err.message,
                    stack: err.stack,
                    name: err.name
                }
            });
        }       
    }
    
}