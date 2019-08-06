const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortId = require('shortid')
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

function isValidDate(date) {
  return (date instanceof Date && !isNaN(date.getTime()));
}

const userSchema = mongoose.Schema({
  _id: {type: String, unique: true, default: shortId.generate},
  username: {type: String, required: true},
  count: Number,
  exercises: [{
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: String, default: new Date().toDateString()}
   }]
})

const User = mongoose.model('User', userSchema)

// api to post new username
app.post("/api/exercise/new-user", (req, res) => {
  var username = req.body.username

  User.findOne({username: username}, (err, data) => {
    if (err) {
      res.send(err);
    }

    if (data == null) {
      var newUser = new User({
        username: username,
        count: 0,
        logs: []
      })

      newUser
      .save()
      .then((data) => {
        res.json({username: data.username, _id: data._id})
      })

    } else {
      res.send("username already taken.")
    }
  })
})

app.post("/api/exercise/add", (req, res) => {
  var userId = req.body.userId
  var description = req.body.description
  var duration = req.body.duration
  var date = req.body.date

  if (date === "") {
    date = new Date().toDateString()
  } else {
    date = new Date(date).toDateString()
  }

  User.findById(userId, (err, data) => {
    if (err) res.send(err)

    if (data == null) {
      res.send("UserId not found!")
    } else {
      var newExercise = {
        description: description,
        duration: duration,
        date: date
      }
      console.log("data:", data);
      data.exercises.push(newExercise)
      data.count += 1;

      data.save((err, data) => {
        if (err) {
          res.send(err)
        } else {
          res.json({
            _id: data._id,
            username: data.username,
            description: description,
            duration: duration,
            date: date
          })
        }
      })

    }
  })
})

app.post("/api/exercise/log/", (req, res) => {
  var userId = req.body.userId
  var fromDate = new Date(req.body.from)
  var toDate = new Date(req.body.to)
  var limit = Number(req.body.limit)

  User.findById(userId, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      if (data == null) {
        res.json({error: "User not found"})
      } else {
        var exercises = data.exercises.map((exercise) => {
          return {
            date: exercise.date,
            description: exercise.description,
            duration: exercise.duration
          }
        })

        if (isValidDate(fromDate)) {
          exercises = exercises.filter((exercise) => {
            return (new Date(exercise.date)) >= fromDate
          })
        }

        if (isValidDate(toDate)) {
          console.log('toDate', toDate)
          exercises = exercises.filter((exercise) => {
            return (new Date(exercise.date)) <= toDate
          })
        }

        if (limit != null && limit != 0) {
          exercises = exercises.slice(0, limit)
        }

        res.json({_id: userId,
                  username: data.username,
                  count: data.count,
                  exercises: exercises})
      }
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
