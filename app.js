import cors from 'cors'
import express from 'express'
import { getContacts,upsertContact, deleteContact } from './src/controller/contactController.js'
import { Contacts, PhoneNumber, Email } from './src/models/index.js'
import { checkConnection, sequelize } from './src/db/dbHelper.js'
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/api/contact/', getContacts)
app.post('/api/contact/', upsertContact)    
app.delete('/api/contact/:id', deleteContact)

checkConnection()
  .then(() => {
    sequelize.sync({ alter: true }).then(() => {
      app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}/`);
      });
    }); 
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })


