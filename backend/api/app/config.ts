import dotenv from "dotenv";

dotenv.config();

const {DB_HOST, DATABASE, DB_PASS, DB_USER} = process.env;
class mysqlConfig {
    host = DB_HOST;
    user = DB_USER;
    password = DB_PASS;
    database = DATABASE;

    constructor(){
        return {host: this.host, user: this.user, password: this.password, database: this.database};
    }
}

const dbConfig = new mysqlConfig();

export default dbConfig;