import {DataTypes, where} from 'sequelize'
import {postgress, mariadb, sorceDb} from '../config/dbConfig.js';
import {env} from 'node:process'
import debugLib from 'debug'

const debug = debugLib('express0:user:service');
const dbSync = (env.SUBD_DB_SYNC || 'no') === 'yes';
const subd = sorceDb=='mariadb'? mariadb:postgress;

class UserModele {
    constructor (db) {
        this.db=db;
        this.User = this.db.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            login: {
                type: DataTypes.STRING(32),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(32),
            },
            surname: {
                type: DataTypes.STRING(32),
            },
            descript: {
                type: DataTypes.STRING(500),
            },
            }, {
                tableName: 'users',
                timestamps: false,
                // freezeTableName: true,
            });
    }
    async init (){
        try {
                if(dbSync) {
                    await this.User.sync({force: true});
                    debug('Таблица создана либо пересоздана!!!');
                } else {
                    // Пробуем получить описание таблицы
                 try {  const tableDescription = await this.User.describe();
                        const columns = Object.keys(tableDescription).join(', ');
                    
                        // Считаем количество записей
                        const count = await this.User.count();
                    
                        debug(`Синхронизация не требуется. Таблица 'users' существует.`);
                        debug(`Поля таблицы: ${columns}`);
                        debug(`Количество записей: ${count}`);
                    
                        // Можно также получить несколько примеров записей
                        if (count > 0) {
                            const samples = await this.User.findAll({ 
                                limit: 3,
                                attributes: ['id', 'login'] // не показываем пароли
                            });
                            debug(`Примеры записей (первые 3):`, 
                                samples.map(u => ({ id: u.id, login: u.login }))
                            );
                        }
                    }  catch (describeError) {
                        // Таблицы может не существовать
                        debug(`Таблица 'users' не найдена. Необходимо изменить .env для создания таблицы!!!`);
                        debug(`Detal: ${describeError.message}`);
                    }
                }
            } catch (err) {
                debug(`Произошла ошибка синхронизации: ${err}`)
        }
            }
    async getAll() {
       try {
            const result = await this.User.findAll({attributes:['id','login']});
            return {
                status: 'success',
                data: result
            }
        } catch (error) {
            debug (error);
            throw error;
        }

    }
    //сомнительно!!!
    async getLogin(id, password) {
        try {
            const result = await this.User.findOne({where:{id,password}});
            return {
                status:'success',
                data:result
            }
        } catch(error) {
            debug (error);
            throw error;
        }
    }
    async chekLogin(login) {
        try {
            const result = await this.User.findOne({
                where:{login},
                attributes:['id','login','password']
            });
            debug (result)
            return result
        } catch (error){
            debug (error);
            throw error;
        }
    }
    async getOne(id) {
        try {
            const result = await this.User.findOne({
                where: {id}, 
                attributes:[
                    'id',
                    'login'
                ]
            });
            return {
                status: 'success',
                data: result
            }
        } catch (error) {
            debug (error);
            throw error;
        }
    }
    async getFull(id){
        try {
            debug('id>>>>>>>>>>>',id)
            const result =await this.User.findOne({
                where:{id},
                attributes:{
                    exclude:['password'],
                }
            });
            return {
                status: 'success',
                data:result
            }
        } catch (error) {
            debug (error);
            throw error;
        }
    }
    async add(user) {
        try {

            const created = await this.User.create({
                login: user.login,
                password:user.password,
                comment:user.comment,
            });
            return {
                status: 'success',
                data: created
            }
        } catch (error) {
            debug (error);
            throw error;
        }
    }

    async edit(user, id) {
        try {
            const payload = {};

            if (user.login) payload.login = user.login;
            if (user.name) payload.name = user.name;
            if (user.surname) payload.surname = user.surname;
            if (user.descript) payload.descript = user.descript;
            const updated = await this.User.update(payload, {where: {id}});
            return {
                status: 'success',
                data: updated
            }

        } catch (error) {
            debug (error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await this.User.destroy({where: {id}});
        } catch (error) {
            debug (error);
            throw error;
        }
    }
}

const userService = new UserModele(subd);

export default userService