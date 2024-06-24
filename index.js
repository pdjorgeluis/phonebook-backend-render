const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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

app.use(express.json())
app.use(cors())

morgan.token('body', (request, response) => {
    const body = JSON.stringify(request.body)
    return body !== '{}' ? body : '-';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${Date()}</p>`)
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }
    const id = Math.floor(Math.random() * 100)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


/*
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)*/