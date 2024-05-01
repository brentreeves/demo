const express = require("express");
const fs = require("node:fs");

const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("./firebase.js");

// set up express web server
const app = express();
app.use(express.json());

// set up static content
app.use(express.static("public"));

// last known count
let count = 0;

app.get("/hooks", async (req, res) => {
  const rc = db.collection("github").doc("hooks");
  const doc = await rc.get();
  if (!doc.exists) {
    return res.sendStatus(400);
  }

  res.status(200).send(doc.data());
});

app.get("/addhook/:team/:event/:huffman", async (req, res) => {
  const { team, event, huffman } = req.params;
  console.log(`/addhook team: ${team} event: ${event}, [${huffman}]`);
  const rc = db.collection("github").doc("hooks");
  if (huffman && huffman == "purple") {
    console.log("secret code word accepted", team, event);
    const res2 = await rc.set(
      {
        [team]: { event: event, timestamp: FieldValue.serverTimestamp() },
      },
      { merge: true }
    );
  }
  res.status(200).send(rc);
});

// Main page
app.get("/", async (_request, response) => {
  // increment counter in counter.txt file
  try {
    count = parseInt(fs.readFileSync("counter.txt", "utf-8")) + 1;
  } catch {
    count = 1;
  }

  fs.writeFileSync("counter.txt", count.toString());

  // render HTML response
  try {
    const content = fs
      .readFileSync("views/index.tmpl", "utf-8")
      .replace("@@COUNT@@", count.toString());
    response.set("Content-Type", "text/html");
    response.send(content);
  } catch (error) {
    response.send();
  }
});

// Start web server on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
