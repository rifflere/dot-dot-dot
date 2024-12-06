// Get packages 
const express = require('express');
const mariadb = require('mariadb');

// 
require('dotenv').config();

// Instantiate an express (web) app
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Define a port number for the app to listen on
const PORT = 3000;

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database')
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err);
    }
}

// Tell the app to encode data into JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Set your view (templating) engine to "EJS"
// (We use a templating engine to create dynamic web pages)
app.set('view engine', 'ejs');

// Define a "default" route
app.get('/', (req, res) => {
    // add empty errors array
    res.render('home');
});

app.get('/add', (req, res) => {
    res.render('add', { data: {}, errors: [] });
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/submit', (req, res) => {
    res.render('wrong-page');
});

app.get('/art', async (req, res) => {
    const conn = await connect();
    const data = await conn.query (`SELECT * FROM art ORDER BY date_submitted DESC`);

    res.render('art', { art : data});
});


app.post('/submit', async (req, res) => {
    // get data from form
    const data = req.body;

    // setting up validation
    let isValid = true;
    let errors = [];

    // checking for empty values
    if (data.box == ''){ 
        isValid = false;
        errors.push('You must enter a number.');
    }

    if (data.artist == ''){
        isValid = false;
        errors.push('You must enter a name.');
    }

    // stop running and send the user to the home page
    if(!isValid){
        res.render('add', {data: data, errors: errors});
        return;
    }

    // connect to the database
    const conn = await connect();

    // write to the database
    if (data.comm == "") {
        await conn.query(`INSERT INTO art (color, box, artist) VALUES ('${data.color}', ${data.box}, '${data.artist}')`);
    } else {
        await conn.query(`INSERT INTO art (color, box, artist, comm) VALUES ('${data.color}', ${data.box}, '${data.artist}', '${data.comment}')`);
    }

    // render the confirmations page and pass in form data
    res.render('confirm', { displayData : data });
});

// Tell the app to listen for requests on the designated port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});

