import {DataTypes} from 'sequelize'
import {postgress, mariadb,sorceDb} from '../config/dbConfig.js';
import {env} from 'node:process'
import debugLib from 'debug'

const debug = debugLib('express0:order:service');
const dbSync = (env.SUBD_DB_SYNC || 'no') === 'yes';
const subd = sorceDb=='mariadb'? mariadb:postgress;

class OrderModele {
    constructor (db) {
        this.db=db;
        this.Order = this.db.define('Order', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model:'customers',
                    key:'id',
                    onDelete:'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },
            // price: {
            //     type: DataTypes.FLOAT,
            //     allowNull: false,
            // }
            }, {
                tableName: 'orders',
                timestamps: false,
                // freezeTableName: true,
            });
    }
    async init (){
        try {
                if(dbSync) {
                    await this.Order.sync({force: true});
                    debug('Таблица создана либо пересоздана!!!');
                } else {
                    // Пробуем получить описание таблицы
                 try {  const tableDescription = await this.Order.describe();
                        const columns = Object.keys(tableDescription).join(', ');
                    
                        // Считаем количество записей
                        const count = await this.Order.count();
                    
                        debug(`Синхронизация не требуется. Таблица 'order' существует.`);
                        debug(`Поля таблицы: ${columns}`);
                        debug(`Количество записей: ${count}`);
                    
                        // Можно также получить несколько примеров записей
                        if (count > 0) {
                            const samples = await this.Order.findAll({ 
                                limit: 3,
                            });
                            debug(`Примеры записей (первые 3):`, 
                                samples.map(o => ({ id: o.id, ccustomer_id: o.customer_id}))
                            );
                        }
                    }  catch (describeError) {
                        // Таблицы может не существовать
                        debug(`Таблица 'order' не найдена. Необходимо изменить .env для создания таблицы!!!`);
                        debug(`Detal: ${describeError.message}`);
                    }
                }
            } catch (err) {
                debug(`Произошла ошибка синхронизации: ${err}`)
        }
            }
    // async getAll() {
    //    try {
    //         const result = await this.Product.findAll();
    //         return {
    //             status: 'success',
    //             data: result
    //         }
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }

    // }
    // async getOne(id) {
    //     try {
    //         const result = await this.Product.findOne({where: {id}});
    //         return {
    //             status: 'success',
    //             data: result
    //         }
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }

    // async add(product) {
    //     try {
    //         if(!product.name) throw new Error ('Название (name) !!!');
    //         if(!product.price) throw new Error ('Цена (price) !!!');
    //         const created = await this.Product.create({
    //             name: product.name,
    //             price: product.price
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

    // async edit(product, id) {
    //     try {
    //         const payload = {};

    //         if (product.name) {
    //             payload.name = product.name;
    //         }

    //         if (product.price) {
    //             payload.price = product.price;
    //         }

    //         const updated = await this.Product.update(payload, {where: {id}});

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
    //         await this.Product.destroy({where: {id}});
    //     } catch (error) {
    //         debug (error);
    //         throw error;
    //     }
    // }
}

const orderService = new OrderModele(subd);

export default orderService