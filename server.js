const express = require("express");
const path = require("path");
// const _ = require("lodash");
const fs = require("fs");
const util = require("util");

const app = express();
const PORT = process.env.PORT || 3100;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// Routes
// =============================================================

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes
// =============================================================

// Should read the db.json file and return all saved notes as JSON.

app.get("/api/notes", async (req, res) => {
    console.log("Attempting to read file");
    try {
        let fileData = await readFileAsync(path.join(__dirname, "/db/db.json"),'utf-8');
        return res.json(JSON.parse(fileData));
    } catch (err) {
        console.log(err);
    }
    // return res.send("THIS IS BULLSHIT");
});

//     let rawdata = fs.readFileSync(path.join(__dirname, "/db/db.json"),'utf-8');
//     parsedData = JSON.parse(rawdata);
//     console.log(parsedData);
//     return res.json(parsedData);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.

app.post("/api/notes", async (req, res) => {
    let userEntry = JSON.stringify(req.body);
    console.log(JSON.parse(userEntry));
    try {
        let fileData = await readFileAsync(path.join(__dirname, "/db/db.json"),'utf-8');
        let notesArray = JSON.parse(fileData);
        console.log(notesArray);
        notesArray.push(JSON.parse(userEntry));
        await writeFileAsync(path.join(__dirname, "/db/db.json"), JSON.stringify(notesArray));
        console.log("Notes database has been successfully updated!")
        return res.json(userEntry);
    } catch (err) {
        console.log(err);
    }
});

// Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

app.delete("/api/notes/:id", function () {
    waitlist.length = 0;
    reservations.length = 0;
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
