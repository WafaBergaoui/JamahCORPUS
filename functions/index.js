const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');
const { firestore } = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

exports.createSynthesis = functions.firestore.document("users/{userId}")
    .onCreate((snapshot, context) => {
      const userId = context.params.userId;
      admin.firestore().collection("synthesis").add({
        userId: userId,
        sommeTTC: "0",
        sommeTVA: "0",
        sommeHT: "0",
      });
    });

exports.onCreatePost = functions.firestore.document("posts/{postId}")
    .onWrite((snapshot, context) => {
      const idUser = snapshot.after.data().idUser;
      getSumTVA(idUser);
      getSumTTC(idUser);
      getSumHT(idUser);
    });

/**
 * @param {string} userId userId.
 */
 async function getSumHT(userId) {
  try {
    const posts = await db.collection("posts")
        .where("idUser", "==", userId).get();
    let sommeMontantHT = 0;
    posts.forEach((doc) => {
      const montantHT = parseFloat(doc.data().montant_ht);
      if (!isNaN(montantHT)) {
        sommeMontantHT = sommeMontantHT + montantHT;
      } else {
        console.log("HT not Found");
      }
    });
    db.collection("synthesis")
        .where("userId", "==", userId).get()
        .then((snap) => {
          snap.forEach((doc) => {
            admin.firestore().collection("synthesis").doc(doc.id).update({
              sommeHT: sommeMontantHT.toString(),
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} userId userId.
 */
async function getSumTVA(userId) {
  try {
    const posts = await db.collection("posts")
        .where("idUser", "==", userId).get();
    let sommeMontantTVA = 0;
    posts.forEach((doc) => {
      const montantTVA = parseFloat(doc.data().montant_tva);
      if (!isNaN(montantTVA)) {
        sommeMontantTVA = sommeMontantTVA + montantTVA;
      } else {
        console.log("TVA not Found");
      }
    });
    db.collection("synthesis")
        .where("userId", "==", userId).get()
        .then((snap) => {
          snap.forEach((doc) => {
            admin.firestore().collection("synthesis").doc(doc.id).update({
              sommeTVA: sommeMontantTVA.toString(),
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} userId userId.
*/
async function getSumTTC(userId) {
  try {
    const posts = await db.collection("posts")
        .where("idUser", "==", userId).get();
    let sommeMontantTTC = 0;
    posts.forEach((doc) => {
      const montantTTC = parseFloat(doc.data().montant_ttc);
      if (!isNaN(montantTTC)) {
        sommeMontantTTC = sommeMontantTTC + montantTTC;
      } else {
        console.log("TTC not Found");
      }
    });
    db.collection("synthesis")
        .where("userId", "==", userId).get()
        .then((snap) => {
          snap.forEach((doc) => {
            admin.firestore().collection("synthesis").doc(doc.id).update({
              sommeTTC: sommeMontantTTC.toString(),
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
  } catch (err) {
    console.error(err);
  }
}

/**
 * /**
 * @param {string} userId userId.
 * @param {string} title title.
 * send a push notification to the user
 */
async function sendNotification(userId, title) {
  const messages = [];
  
  return admin.firestore().collection("users")
      .doc(userId).get()
      .then((doc) => {
        const pushToken = doc.data().expoPushToken;
        if (pushToken) {
          messages.push({
            "to": pushToken,
            "body": `La facture ${title} arrive à échéance`,
          });
        }
        return Promise.all(messages);
      }).then((messages) => {
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        });
      });
}

exports.sendPushNotification = functions.pubsub.schedule("0 8 * * *")
    .onRun(async (context) => {
      const today = new Date();
      const currentDate = today.getFullYear()+"-"+(today.getMonth()+1)+
      "-"+today.getDate();

      const query = await db.collection("posts")
          .where("date", "==", currentDate)
          .get();

      query.forEach(async (snapshot) => {
        sendNotification(snapshot.data().idUser, snapshot.data().title);
      });
    });

// Remarque: Il faut améliorer cette fonction!!!!!
const getAllDate = (data) => {
  FormatDate1 = /\d{2} (Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre) \d{4}/gi ;  //dd mois yyyy
  FormatDate2 = /\d{2}\/\d{2}\/\d{4}/g ;
  FormatDate3 = /\d{2}\/\d{2}\/\d{2}/g ;
  FormatDate4 = /\d{2}\-\d{2}\-\d{4}/g;
  FormatDate5 = /\d{2}\-\d{2}\-\d{2}/g;
  FormatDate6 = /\d{2}\.\d{2}\.\d{4}/g;
  FormatDate7 = /\d{2}\.\d{2}\.\d{2}/g;


      if(data.match(FormatDate1)){
        return data.match(FormatDate1);
      }else if (data.match(FormatDate2)) {
        return data.match(FormatDate2);
      }else if (data.match(FormatDate3)) {
        return data.match(FormatDate3);
      }else if (data.match(FormatDate4)) {
        return data.match(FormatDate4);
      }else if (data.match(FormatDate5)) {
        return data.match(FormatDate5);
      }else if (data.match(FormatDate6)) {
        return data.match(FormatDate6);
      }
}

const getDate = (data) => {
  let date = getAllDate(data);
    return date[0];
}

const getDateEcheance = (data) => {
  let date = getAllDate(data);
  return date[date.length - 1]
}

exports.extractDataFromPosts = functions.firestore.document("posts/{postId}")
.onCreate(async (snapshot, context) => {
  const postId = context.params.postId;
  const imageURL = snapshot.data().url;
  const category = snapshot.data().category;
  const isProcessed = snapshot.data().isProcessed; 
    // Creates a client
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'jamah-e6e58-50316711ee9a.json'
    });
    if (isProcessed == false){
      if(category == "Factures Fournisseurs" || category == "Factures Client"){
        const [result] = await client.documentTextDetection(imageURL);
        const detections = result.textAnnotations;
        admin.firestore().collection("posts").doc(postId).update({
          nom_prestataire: detections[0].description.split('\n')[0],
          date_facture: getDate(detections[0].description),
          date_echeance: getDateEcheance(detections[0].description),
        });
      }else if (category == "Note de frais"){
        const [result] = await client.documentTextDetection(imageURL);
        const detections = result.textAnnotations;
        detections.forEach(text => console.log(text.description));
        admin.firestore().collection("posts").doc(postId).update({
          nom_enseigne: detections[0].description.split('\n')[0],
          date : getDate(detections[0].description),
        });
      }
    }
});
