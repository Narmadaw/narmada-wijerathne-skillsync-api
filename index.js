const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const jobRoute = require("./routes/jobRoute");

const PORT = process.env.PORT || 5000
const {CORS_ORIGIN} = process.env;

//middleware
app.use(express.json());
app.use(cors({origin: CORS_ORIGIN})); 

//routes
app.use("/jobs", jobRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });