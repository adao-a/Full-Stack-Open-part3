const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(cors()) 
app.use(express.static('build')) 
app.use(express.json()) 

morgan.token('person', requset => {
    return JSON.stringify(require.body)
})
app.use(morgan(':method :url :status :res[content-length] :total-time[3] :person'))

//getAllperson
app.get('/api/persons', (requset, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//getPersonsInfo
app.get('/info', (requset, response) => {
    Person.count().then(persons_count => {
        response.send(
            `<h2>Phonebook has info for ${persons_count} people</h2>
            <h2> ${new Date}</h2>
            `)
    })
})

//getPerson
app.get('/api/persons/:id', (requset, response, next) => {
    Person.findById(requset.params.id)
        .then(person => {
            response.json(person)
        }).catch(error => {
            next(error)
        })
})

//deletePerson
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    }).catch(error => {
        next(error)
    })
})

//addPerson
app.post('/api/persons', (requset, response, next) => {
    const { name, number } = requset.body
    const person = new Person({
        name,
        number
    })
    person.save()
    .then(savePerson => {
        response.json(savePerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }   else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})