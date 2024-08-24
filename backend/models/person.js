// import mongoose
const { default: mongoose } = require("mongoose");

// set mongoose options
mongoose.set("strictQuery", false)

// Define url to connect to mongodb
const url = process.env.MONGODB_URI;
console.log("Connecting to ", url)

//connect to mongodb
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

//define the schema 
const phoneRegex = /^(\d{2,3})-(\d{5,})$/;

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Phone number must be in the form XX-XXXXXXX or XXX-XXXXXXXX.`
    },
    required: [true, 'User phone number required']
  }
});

// transform the output of id from object to string
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)