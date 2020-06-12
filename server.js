const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3100;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
// =============================================================

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes
// =============================================================

app.get("/api/notes", async (req, res) => {
    console.log("Attempting to read file");
    try {
        let fileData = await readFileAsync(path.join(__dirname, "/db/db.json"), 'utf-8');
        return res.json(JSON.parse(fileData));
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/notes", async (req, res) => {
    let userEntry = JSON.stringify(req.body);
    console.log(JSON.parse(userEntry));
    try {
        let fileData = await readFileAsync(path.join(__dirname, "/db/db.json"), 'utf-8');
        let notesArray = JSON.parse(fileData);
        let newNote = JSON.parse(userEntry);
        newNote.id = uuidv4();
        notesArray.push(newNote);
        await writeFileAsync(path.join(__dirname, "/db/db.json"), JSON.stringify(notesArray));
        console.log("Notes database has been successfully updated!");
        return res.json(userEntry);
    } catch (err) {
        console.log(err);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    let fileData = fs.readFileSync(path.join(__dirname, "/db/db.json"), 'utf-8');
    let notesArray = JSON.parse(fileData);
    for (note of notesArray) {
        if (note.id == noteId) {
            notesArray.pop(note);
            fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notesArray));
        }
    }
    res.json({message: "File Deleted"});
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
