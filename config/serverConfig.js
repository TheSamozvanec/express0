'user strict'
import 'dotenv/config' // инвы 
//import { DataTypes } from 'sequelize' // перенести в сервисы
import {exit, env, platform} from 'node:process' // мягкий стоп и  иннициализация db
import readline from 'node:readline' // мягкий стоп 
import expressHandlebars from 'express-handlebars' //шаблонизатор
import { helpers } from './helpers.js'
import {postgress, mariadb} from './dbConfig.js'
import debugLib from 'debug'

const debug = debugLib('express0:server-config');

export const PORT = env.MAIN_PORT 

export const secret = env.COOKIE_SECRET

export const jwtExpires =env.JWT_EXPIRES_IN

export const handlebars = expressHandlebars.create({
    defaultLayout: 'main', // лейаут по умолчанию main.hbs
    extname: 'hbs', // расширение файла для render 
    helpers // набор функций которые можно использовать в hbs править в модуле
});

export const sessions = { // для сессий
    secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false, // можно и в http
        maxAge:60*60*1000, // живет час
        httpOnly:true,
        sameSite:'lax',
    }
}

export async function ConnetctTest(test=false) {
    let error, PG, MDB
    try {
        // postgress auth
        await postgress.authenticate();
        debug('Подключение к PostgreSQL успешно установлено!');    
        const [results0] = await postgress.query('SELECT NOW() as current_time');
        debug('Время на сервере БД:', results0[0].current_time);
        PG=true
        // mariadb auth
        await mariadb.authenticate();
        debug('Подключение к mariadb успешно установлено!');
        const [results] = await mariadb.query('SELECT NOW()');
        debug('Время:', results[0]['NOW()']); 
        MDB=true;
        
    } catch (err){
        console.error('Ошибка подключения:', err);
        if (PG) {await postgress.close()}
    } finally {
        if(test) {
            await postgress.close();
            await mariadb.close();
            debug('Успешный тест на авторизацию!!!');
            exit(2);
        };

        if(error) {
            console.error(`Ошибка подключения ${error}`);
            exit(99);
        }
    }  
}

export function closeServer(){
   if (platform==='win32'){
        const rl = readline.createInterface({
                input: stdin,
                output: stdout
            });
        rl.on ('SIGINT', () => process.emit('SIGINT'));
   }
   process.on('SIGINT', async ()=>{
    try {
        await postgress.close();
        debug(' Отключился от postgreSQL');
        await mariadb.close();
        debug(' Отключился от mariadb');
        exit (0);
    } catch(error) {
        console.error(`Проблемы с отключением от базы данных: ${error}`);
        exit (98)
    }
   });

}
