const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

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
      });
    });

exports.onCreatePost = functions.firestore.document("posts/{postId}")
    .onWrite((snapshot, context) => {
      const idUser = snapshot.after.data().idUser;
      getSumTVA(idUser);
      getSumTTC(idUser);
    });

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
