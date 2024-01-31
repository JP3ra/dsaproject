const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs"); 

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb+srv://dishannaik:disha123@cluster0.5zbzdvu.mongodb.net/dsaproject?retryWrites=true&w=majority")
db = mongoose.connection;

app.post("/signup", (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phonenumber = req.body.phno;


    var data = {
        "name": name,
        "email": email,
        "phonenumber": phonenumber,
        "password": password
    }

    db.collection('signup').insertOne(data,(err, collection)=>{
        if(err){
            throw err;
        }
        console.log("Inserted record successfully");
    });

    return res.redirect('signupsuccess.html');


})

app.post('/marks', (req, res)=>{
    // subject, credits, cie, see
    var name = req.body.name;
    var subject = req.body.subject;
    var credits = req.body.credits;
    var cie = req.body.cie;
    var see = req.body.see;

    var data = {
        "name": name,
        "subject": subject,
        "credits": credits,
        "cie": cie,
        "see": see
    }

    db.collection('marks').insertOne(data,(err, collection)=>{
        if(err){
            throw err;
        }
        console.log("Inserted record successfully");
    });
})

app.post("/login", (req, res) => {
    var name = req.body.name;
    var password = req.body.password;

    db.collection('signup').findOne({ "name": name, "password": password }, (err, user) => {
        if (err) {
            throw err;
        }

        if (user) {
            console.log("User found successfully");

            db.collection('marks').findOne({ "name": name }, (err, marks) => {
                if (err) {
                    throw err;
                }

                if (marks) {
                    console.log("Marks found:", marks);
                    // Render the marks.ejs page and pass the marks data
                    return res.render('marks.ejs', { marks: [marks] }); // Ensure marks is an array
                } else {
                    console.log("Marks not found");
                    // Render the marks.ejs page with an empty array
                    return res.render('marks.ejs', { marks: [] });
                }
            });
        } else {
            console.log("User not found");
            return res.redirect('failed.html');
        }
    });
});

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on port 3000");