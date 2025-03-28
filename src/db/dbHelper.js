import mysql from "mysql2/promise";
import { dbConfig } from "./dbConfig.js";

const connectionPool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
});

async function checkConnection() {
    return await connectionPool.getConnection(async (err, connection) => {
      if (err) {
        console.log("Error connecting to database: ", err);
      } else {
        console.log("Successfully connected to database.");
      }
      connection.release();
    });
}
export { connectionPool, checkConnection };