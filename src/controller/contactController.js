import sequelize from "sequelize";
import { Contacts } from '../models/index.js';

export async function getContacts(req, res) {
  try {
    const result = await Contacts.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("dob"), "%Y-%m-%d"),
            "dob",
          ],
        ],
        exclude: ["dob"],
      },
    });
  
    const contactList = result.map((con) => {
      let phoneNumbers = [];
      let emails = [];
  
      try {
        if (typeof con.phoneNumbers === 'string') {
          const parsedPhones = JSON.parse(con.phoneNumbers);
          phoneNumbers = Array.isArray(parsedPhones) ? parsedPhones.map(String) : [];
        } else if (Array.isArray(con.phoneNumbers)) {
          phoneNumbers = con.phoneNumbers.map(String);
        }
      } catch (err) {
        console.error("Invalid phoneNumbers JSON for contactId", con.contactId, "->", con.phoneNumbers);
      }
  
      try {
        if (typeof con.emails === 'string') {
          const parsedEmails = JSON.parse(con.emails);
          emails = Array.isArray(parsedEmails) ? parsedEmails.map(String) : [];
        } else if (Array.isArray(con.emails)) {
          emails = con.emails.map(String);
        }
      } catch (err) {
        console.error("Invalid emails JSON for contactId", con.contactId, "->", con.emails);
      }
  
      return {
        id: con.contactId,
        firstName: con.firstName,
        lastName: con.lastName,
        nickname: con.nickName,
        dateOfBirth: con.dob,
        phoneNumber: phoneNumbers,
        email: emails,
      };
    });
  
    console.log(contactList);
    res.json(contactList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
  
}


export async function upsertContact(req, res) {   
    try{
        if(!req.body.id) {
            const con = await Contacts.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              nickName:  req.body.nickname,
              dob: req.body.dateOfBirth,
              phoneNumbers:req.body.phoneNumber,
              emails: req.body.email
            });
                return res.json(con);
        }
        const con = await Contacts.findByPk(req.body.id);

        con.update({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nickName:  req.body.nickname,
          dob: req.body.dateOfBirth,
          phoneNumbers: req.body.phoneNumber,
          emails: req.body.email
        });   
        
        console.log(con);
        res.json(con);
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

export async function deleteContact(req, res) {
    try {
    await Contacts.destroy({
      where: {
        contactId: req.params.id,
      },
    });
        res.json("Deleted");
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

