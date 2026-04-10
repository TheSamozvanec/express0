import 'dotenv/config' // инвы 
import {env} from 'node:process'
import {Sequelize} from 'sequelize'
// необходимы компоненты диалектов (mariadb - не работает) mysql2, pg, pg-hstore


const mariadbConfig = {
    data:env.MARIADB_DATABASE,
    root:env.MARIADB_ROOT,
    rootPass:env.MARIADB_ROOT_PASSWORD,
    user:env.MARIADB_USER,
    password:env.MARIADB_PASSWORD,
    PORT:env.MARIADB_PORT,
}

const postgresConfig = {
    data:env.POSTGRES_DB,
    user:env.POSTGRES_USER,
    password:env.POSTGRES_PASSWORD,
    PORT:env.POSTGRES_PORT
}

export const postgress = new Sequelize ({
    dialect:'postgres',
    host:'localhost',
    port:postgresConfig.PORT,
    database:postgresConfig.data,
    username:postgresConfig.user,
    password:postgresConfig.password,
    logging:false, // не выдавать в консоль sql 
});

export const mariadb = new Sequelize ({
    dialect:'mysql',
    host:'localhost',
    port:mariadbConfig.PORT,
    database:mariadbConfig.data,
    username:mariadbConfig.root,
    password:mariadbConfig.rootPass,
    logging:false, // не выдавать в консоль sql 
});

export const sorceDb = env.SUBD_DB_SELECT
