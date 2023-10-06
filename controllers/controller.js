const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config()


const  secret = process.env.SECRET


const createFormattedDate = () => {
  // creating formatted date of workout creation
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const formattedDate = `${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}



const handleSignup = async (req, res) => {

  try {
    const { email, password } = req.body

    // checking if user already exists
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      // User with the same email already exists, return an error response
      return res.status(400).json({ detail: 'Email already in use' });
    }

    // encrypting password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const signUp = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hashedPassword]
    )

    const token = jwt.sign({ email }, secret, { expiresIn: '1h' })
    
    
    const error = signUp.name === 'error'
    
    if (!error) {
      res.json({ email, token })
  } else {
      res.json({ detail: signUp.detail})
  }
  

  } catch (error) {
    res.json(error)
    //console.error(error)
  }
}



const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const users = await pool.query('SELECT * FROM users WHERE email = $1;', [email])
    //console.log(users)
  
    if (!users.rows.length) return res.json({ detail: 'User does not exist'})

    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

    if (success) {
        res.json({ "email" : users.rows[0].email , token })   // console(response.data) in frontend will give this json data
    } else {
        res.json({ detail: 'Login failed'})
    }


} catch (error) {
    console.error(error)
}
}



const getAllWorkouts  = async (req, res) => {

    const { userEmail } = req.params    // req.params = currentUser email from /workouts/:userEmail <-- param variable

    try {
        const workout = await pool.query(
            'SELECT * FROM workouts WHERE user_email = $1', [userEmail]
            );      // $1 = first parameter in array = userEmail array, use $2 for additional parameters
         res.json(workout.rows)     //.rows else lot of extra stuff will be sent
    }
    catch (e) {
        console.log(e.message);
    }
}




const createNewWorkout = async (req, res) => {

    try {
        const { user_email, exercise_title, load, reps, progress } = req.body
        const date = createFormattedDate();

        if (!user_email || !exercise_title || !load || !reps || !progress || !date) {
          return res.status(400).json({ error: "Missing required parameters" });
        }

        const newWorkout = await pool.query(
          `INSERT INTO workouts (user_email, exercise_title, load, reps, progress, date) VALUES($1, $2, $3, $4, $5, $6)`,
          [user_email, exercise_title, load, reps, progress, date]
        )
        res.json(newWorkout)

      } catch (error) {
        console.error(error)
      }
}



const editWorkout = async (req, res) => {

const { id } = req.params
  const { user_email, exercise_title, load, reps,  progress } = req.body

  const date = createFormattedDate();

  try {
    const editToDo = await pool.query(
      'UPDATE workouts SET user_email =$1, exercise_title = $2, load = $3, reps = $4, progress = $5, date = $6 WHERE id = $7;',
      [user_email, exercise_title, load, reps, progress, date, id]
    )
    res.json(editToDo)
  } catch (error) {
    console.error(error)
  }
}




const deleteWorkout = async (req, res) => {

  const { id } = req.params
  try {
    const deleteToDo = await pool.query('DELETE FROM workouts WHERE id = $1;', [id])
    res.json(deleteToDo)
  } catch (error) {
    console.error(error)
  }

}




module.exports = {
    handleSignup,
    handleLogin,
    getAllWorkouts,
    createNewWorkout,
    editWorkout,
    deleteWorkout
}