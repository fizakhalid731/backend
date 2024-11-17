const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require('./config/conectDB.js');
const route = require('./routes/router.js');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors({origin: "http://localhost:4200", allowedHeaders: ['Content-Type', 'token'], credentials: true}));




app.use(express.json());
// app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use(route);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
