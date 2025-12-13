import dotenv from 'dotenv';
//import mysql2 from 'mysql2/promise';
import { conn } from './database.js';

dotenv.config();

/*const conn = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port:     process.env.DB_PORT,
    database: process.env.DB_NAME,
    multipleStatements: true
}); */

async function runSQL(sql) {
	console.log("Running SQL:\n", sql);
	const result = await conn.execute(sql);
	console.log(result);
}

runSQL(`DROP TABLE IF EXISTS tasks;`);
runSQL(`DROP TABLE IF EXISTS users;`)
//runSQL(`USE wine_store;`);

runSQL(`CREATE TABLE users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(100) NOT NULL,
		password VARCHAR(100) NOT NULL
);`);

runSQL(`CREATE TABLE tasks (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(100) NOT NULL, 
		description VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`);

runSQL(`INSERT INTO users (username, password) VALUES
	('Mikael', 'kalleskaviar'),
	('Kajsa', 'ostmacka');`);

runSQL(`INSERT INTO tasks (title, description, status, user_id) VALUES
	('Code project', 'Lab2', 'Todo', 1),
	('Fix bugs', 'Lab1', 'Todo', 2),
	('Cook dinner', 'Pasta', 'Doing', 1);`);

const sql = `SELECT * from tasks;`;

const [resultset] = await conn.execute(sql);
console.table(resultset);

conn.close();