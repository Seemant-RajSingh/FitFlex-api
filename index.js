const express = require('express');
const cors = require('cors')
const router = require('./routes/routes')
require('dotenv').config()  



const PORT = process.env.PORT ?? 8000 

const app = express();

app.use(cors());
app.use(express.json())

// get all workouts
app.use("/", router);


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})