import cors from 'cors'
import express from 'express'
import { getContacts, getContact, upsertContact, deleteContact } from './src/controller/contactController.js'
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/api/contact/', getContacts)
app.get('/api/contact/:id', getContact)
app.post('/api/contact/', upsertContact)    
app.delete('/api/contact/:id', deleteContact)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

