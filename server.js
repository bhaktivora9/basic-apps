const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express()
const port = 3000

const db = mysql.createConnection({
    host: 'localhost',    // Change if your database is hosted elsewhere
    user: 'root',         // Your MySQL username
   port:'3306',
    password: 'password',         // Your MySQL password
    database: 'test' // Change to your actual database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});
app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search', (req, res) => {
    const data = req.query.q;  // Get search query parameter

    let sql = "SELECT * FROM users WHERE 1=1";  // Default SQL query (always true)
    let params = [];

    // Build the WHERE condition dynamically based on provided query parameters
    if (data) {
        // Search for both first name and last name
        sql += " AND (fname = ? OR lname = ?)";
        params.push(data);
        params.push(data);
    }

    // Execute the query with the provided parameters
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error retrieving data:", err);
            return res.status(500).send({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.json({ message: "No users found" });
        }

        // Return the data as JSON
        res.json(results);
    });
});


app.post('/subscribe',(req,res)=>{
      console.log(req.body); // Access parsed data


    const { fname, lname, email } = req.body;

    if (!fname || !lname || !email) {
        return res.status(400).send("All fields (fname, lname, email) are required");
    }

    const sql = "INSERT INTO users (fname, lname, email) VALUES (?, ?, ?)";
    db.query(sql, [fname, lname, email], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).send("Database error");
        }
        res.status(201).send(`User ${fname} ${lname} subscribed successfully!`);
    });


});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})