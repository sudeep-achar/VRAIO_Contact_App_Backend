import sequelize from "sequelize";
import { Contacts, Email, PhoneNumber } from '../models/index.js';

export async function getContacts(req, res) {
    try{
    const result = await Contacts.findAll({
        include: [
          {
            model: PhoneNumber,
            attributes: ["phoneNumber"],
          },
          {
            model: Email,
            attributes: ["email"],
          },
        ],
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
    const contactList = result.map((con) => ({
        id: con.contactId,
        firstName: con.firstName,
        lastName: con.lastName,
        nickname: con.nickName,
        dateOfBirth: con.dob,
        phoneNumber: con.PhoneNumbers.map((p) => p.phoneNumber),
        email: con.Emails.map((e) => e.email),
      }));
    console.log(contactList);
    res.json(contactList);
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}


export async function upsertContact(req, res) {   
    try{
        if(!req.body.id) {
            const con = await Contacts.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nickName: req.body.nickname,
                dob: req.body.dateOfBirth,
              });
          
              req.body.phoneNumber.map(
                async (ph) =>
                  await PhoneNumber.create({
                    contactId: con.contactId,
                    phoneNumber: ph,
                  })
              );
          
              req.body.email.map(
                async (em) =>
                  await Email.create({
                    contactId: con.contactId,
                    email: em,
                  })
              );
                return res.json(con);
        }
        const con = await Contacts.findByPk(req.body.id);

        con.update({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nickName: req.body.nickname,
          dob: req.body.dateOfBirth,
        });
    
        await PhoneNumber.destroy({
          where: {
            contactId: req.body.id,
          },
        });
    
        await Email.destroy({
          where: {
            contactId: req.body.id,
          },
        });
    
        req.body.phoneNumber.map(
          async (ph) =>
            await PhoneNumber.create({
              contactId: req.body.id,
              phoneNumber: ph,
            })
        );
    
        req.body.email.map(
          async (em) =>
            await Email.create({
              contactId: req.body.id,
              email: em,
            })
        );
       
        console.log(con);
        res.json(con);
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
}

export async function deleteContact(req, res) {
    try{
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

