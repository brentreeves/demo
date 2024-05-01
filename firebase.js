const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { doc, setDoc } = require("firebase/firestore");

const serviceAccount = require("./creds.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
