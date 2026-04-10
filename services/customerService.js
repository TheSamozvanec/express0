import {DataTypes} from 'sequelize'
import {postgress, mariadb, sorceDb} from '../config/dbConfig.js';
import {env} from 'node:process'
import debugLib from 'debug'

const debug = debugLib('express0:customer:service');
const dbSync = (env.SUBD_DB_SYNC || 'no') === 'yes';
const subd = sorceDb=='mariadb'? mariadb:postgress;

class CustomerModele {
    constructor (db) {
        this.db=db;
        this.Customer = this.db.define('Customer', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true
            }
            }, {
                tableName: 'customers',
                timestamps: false,
                // freezeTableName: true,
            });
    }
    async init (){
        try {
                if(dbSync) {
                    await this.Customer.sync({force: true});
                    debug('Таблица создана либо пересоздана!!!');
                } else {
                    // Пробуем получить описание таблицы
                 try {  const tableDescription = await this.Customer.describe();
                        const columns = Object.keys(tableDescription).join(', ');
                    
                        // Считаем количество записей
                        const count = await this.Customer.count();
                    
                        debug(`Синхронизация не требуется. Таблица 'customers' существует.`);
                        debug(`Поля таблицы: ${columns}`);
                        debug(`Количество записей: ${count}`);
                    
                        // Можно также получить несколько примеров записей
                        if (count > 0) {
                            const samples = await this.Customer.findAll({ 
                                limit: 3,
                                attributes: ['id', 'name'] // не показываем пароли
                            });
                            debug(`Примеры записей (первые 3):`, 
                                samples.map(c => ({ id: c.id, login: c.login }))
                            );
                        }
                    }  catch (describeError) {
                        // Таблицы может не существовать
                        debug(`Таблица 'customers' не найдена. Необходимо изменить .env для создания таблицы!!!`);
                        debug(`Detal: ${describeError.message}`);
                    }
                }
            } catch (err) {
                debug(`Произошла ошибка синхронизации: ${err}`)
        }
            }
    // async getAll() {
    //    try {
    //         const result = await this.User.findAll({attributes:['id','login']});
    //         return {
    //             status: 'success',
    //             data: result
    //         }
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }

    // }
    // async getLogin(id, password) {
    //     try {
    //         const result = await this.User.findOne({where:{id,password}});
    //         return {
    //             status:'success',
    //             data:result
    //         }
    //     } catch(error) {
    //         debug (error);
    //         throw error;
    //     }
    // }
    // async chekLogin(login) {
    //     try {
    //         const result = await this.User.findOne({where:{login}});
    //         return result
    //     } catch (error){
    //         debug (error);
    //         throw error;
    //     }
    // }
    // async getOne(id) {
    //     try {
    //         const result = await this.User.findOne({where: {id}});
    //         return {
    //             status: 'success',
    //             data: result
    //         }
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }

    // async add(user) {
    //     try {

    //         const created = await this.User.create({
    //             login: user.login,
    //             password:user.password
    //         });
    //         return {
    //             status: 'success',
    //             data: created
    //         }
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }

    // async edit(user, id) {
    //     try {
    //         const payload = {};

    //         if (user.login) {
    //             payload.login = user.login;
    //         }

    //         if (user.password) {
    //             payload.password = user.password;
    //         }

    //         const updated = await this.User.update(payload, {where: {id}});

    //         return {
    //             status: 'success',
    //             data: updated
    //         }

    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }

    // async delete(id) {
    //     try {
    //         await this.User.destroy({where: {id}});
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }
}

const customerService = new CustomerModele(subd);

export default customerService