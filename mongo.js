const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password a argument')
  process.exit(1)
}

const process = process.argv[2]

const url = `mongodb+srv://paingkhant0397:${password}@fullstackopen.xkzz5re.mongodb.net/?retryWrites=true&w=majority&appName=fullStackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true
})

note.save().then((result) => {
  console.log('note saved!')
  mongoose.connection.close()
})
