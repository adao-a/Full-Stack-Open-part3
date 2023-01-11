const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

//getAllperson
app.get('/api/persons', (require, response) => {
    response.json(persons)
})

//getPersonsInfo
app.get('/info', (require, response) => {
    response.send(
        `<h2>Phonebook has info for ${persons.length} people</h2>
        <h2> ${new Date}</h2>
        `)
    console.log('new Date', new Date)
})

//getPerson
app.get('/apt/person/:id', (require, response) => {
    const id = Number(require.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).send(`error: no person with id:${id}`)
    }
})

//deletePerson
app.delete('/apt/person/:id', (require, response) => {
    const id = Number(require.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    console.log('persons', persons)
})

const generateId = () => {
    const newId = Math.floor(Math.random() * 1000)
    console.log('newId', newId)
    return newId
}
//addPerson
app.post('/api/persons', (require, response) => {
    const body = require.body
    console.log('body', body)
    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } 

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
    console.log('persons', persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})