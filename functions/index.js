const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.getSommeTTC = functions.https.onRequest((request, response) => {
  let sommeMontantTTC = 0;
  admin.firestore().collection("posts").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const montantTTC = parseFloat(doc.data()
              .montant_ttc);
          if (!isNaN(montantTTC)) {
            console.log(montantTTC);
            sommeMontantTTC = sommeMontantTTC +
            montantTTC;
          } else {
            console.log("TTC not Found");
          }
        });
        console.log("la Somme total des ttc est égal à: " + sommeMontantTTC);
      })
      .catch((error) => {
        console.log(error);
        response.status(500).send(error);
      });
  return (sommeMontantTTC);
});

exports.getSommeTVA = functions.https.onRequest((request, response) => {
  let sommeMontantTVA = 0;
  admin.firestore().collection("posts").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const montantTVA = parseFloat(doc.data()
              .montant_tva);
          if (!isNaN(montantTVA)) {
            console.log(montantTVA);
            sommeMontantTVA = sommeMontantTVA +
            montantTVA;
          } else {
            console.log("TVA not Found");
          }
        });
        console.log("la Somme total des tva est égal à: " + sommeMontantTVA);
      })
      .catch((error) => {
        console.log(error);
        response.status(500).send(error);
      });
  return (sommeMontantTVA);
});
