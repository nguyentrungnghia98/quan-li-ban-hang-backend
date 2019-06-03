const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { port, database } = require("./config");
const app = express();
var admin = require('firebase-admin');
var serviceAccount = require("./key/serviceAccountKey");
let http = require('http').Server(app);


try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://quan-li-ban-hang.firebaseio.com"
    })

}
catch (err) {
    console.log(err)
}

mongoose.connect(
    database,
    { useNewUrlParser: true },
    err => {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected to the database");
        }
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const userRoutes = require("./routes/api");
app.use("/api", userRoutes);
http.listen(port, err => {
    console.log("Start on port", port);
});
