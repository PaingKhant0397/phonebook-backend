require('dotenv').config()

const express = require("express");
const Person = require('./models/person')
const mongoose = require('mongoose')

app = express()
app.use(express.json())

const cors = require('cors');
app.use(cors())

app.use(express.static('dist'))

const morgan = require('morgan');
const { configDotenv } = require("dotenv");
morgan.token('post-data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

// const requestLogger = (request, response, next) => {
//   console.log("method: ", request.method)
//   console.log("path: ", request.path)
//   console.log("body: ", request.body)
//   console.log("----")
//   next()
// }

// app.use(requestLogger)

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>")
})

app.get('/info', (req, res) => {
  res.send("<p>Phonebook has info for two people.</p> <p>Sat Jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time) </p>")
});


app.get("/api/persons", (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error))
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //   res.json(person)
  // } else {
  //   res.status(404).end()
  // }
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

const generateId = () => {
  return String(Math.floor(Math.random() * 10000))
}

const checkIfExist = (newPerson) => {
  return Person.findOne({ name: newPerson.name })
}

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: "name is missing."
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing."
    })
  }

  checkIfExist(body).then(exist => {
    if (exist) {
      return res.status(400).json({
        error: "name already exist on phonebook."
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })


  // const person = {
  //   id: generateId(),
  //   ...body,
  // }

  // persons = persons.concat(person)

  // res.json(person)
});


// For unknown endpoints
const unknownEndpoints = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoints)

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})