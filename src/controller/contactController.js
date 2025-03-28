import {connectionPool} from '../db/dbHelper.js';
export async function getContacts(req, res) {
    try{
    const connection = await connectionPool.getConnection();
    const sql = 'call view_details()';
    const queryResult = await connection.query(sql);
    connection.release();
    const result = queryResult[0][0];
    const contactList = result.map((con) => {
        con.phoneNumber = con.phoneNumber.split(",").map(Number);
        con.email = con.email.split(",").map((email) => email.replaceAll('\"',  ''));
        return con;
      });
    console.log(contactList);
    res.json(contactList);
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

export async function getContact(req, res) {
    try{
        const connection = await connectionPool.getConnection();
        const sql = `call user_details(?)`;
        const queryResult = await connection.query(sql, [req.params.id]);
        connection.release();
        const result = queryResult[0][0];
        let user_d  = result[0];
        if(user_d === undefined){
            res.status(404).send("Contact not found");
        }
        user_d.number = result.map((item) => item.number).filter(onlyUnique);
        user_d.email = result.map((item) => item.email).filter(onlyUnique);
        console.log(user_d);
        res.json(user_d);
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

export async function upsertContact(req, res) {   
    try{
        const connection = await connectionPool.getConnection();
        const sql =`set @id = ?;
        call upsert_contact(?, ?, ?, ?, ?, ?, @id);
        select @id;`;
        const queryResult = await connection.query(sql, 
            [
                req.body.id, 
                req.body.firstName, 
                req.body.lastName, 
                req.body.nickname, 
                req.body.dateOfBirth, 
                JSON.stringify(req.body.phoneNumber),
                JSON.stringify(req.body.email)
            ]);
        connection.release();
        const result = queryResult[0][2];
        console.log(result);
        res.json(result);
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

export async function deleteContact(req, res) {
    try{
        const connection = await connectionPool.getConnection();
        const sql = `call delete_contact(?)`;
        const queryResult = await connection.query(sql, [req.params.id]);
        connection.release();
        const result = queryResult[0][0];
        res.json("Deleted");
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

