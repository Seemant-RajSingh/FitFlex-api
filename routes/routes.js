const express = require('express');

const {
    handleSignup,
    handleLogin,
    getAllWorkouts,
    createNewWorkout,
    editWorkout,
    deleteWorkout
} = require('../controllers/controller')

const router = express.Router();


// signup route
router
.route('/workouts/signup')
.post(handleSignup)


// ligin route
router
.route('/workouts/login')
.post(handleLogin)


// fetch all workouts of the user
router
.route('/workouts/:userEmail')
.get(getAllWorkouts)


// create new workout
router
.route('/workouts')
.post(createNewWorkout)


// edit a workout
router
.route('/workouts/:id')     // id can be accessed via req.params
.put(editWorkout)
.delete(deleteWorkout)

module.exports = router