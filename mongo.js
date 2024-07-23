const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log("please give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://paingkhant0397:${password}@phonebook.ownkkcm.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (password && !name && !number) {
  Person.find({}).then(result => {
    console.log("Person:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    });
    mongoose.connection.close()
  })

}

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    // console.log("result", result)
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}




