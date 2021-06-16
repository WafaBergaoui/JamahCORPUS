const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');

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

// NB: Il faut améliorer cette fonction!!!!!
const getAllDate = (data) => {
  FormatDate1 = /\d{2} (Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre) \d{4}/gi ;  //dd mois yyyy
  FormatDate2 = /\d{2} (Jan|Fev|Mars|Avr|Mai|Jui|Juill|Aout|Sept|Oct|Nov|Dec) \d{4}/gi ;  //dd moi yyyy
  FormatDate3 = /\d{2}\/\d{2}\/\d{4}/g ;
  FormatDate4 = /\d{2}\/\d{2}\/\d{2}/g ;
  FormatDate5 = /\d{2}\-\d{2}\-\d{4}/g;
  FormatDate6 = /\d{2}\-\d{2}\-\d{2}/g;
  FormatDate7 = /\d{2}\.\d{2}\.\d{4}/g;
  FormatDate8 = /\d{2}\.\d{2}\.\d{2}/g;

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
      }else if (data.match(FormatDate7)) {
        return data.match(FormatDate7);
      }
}

const getDate = (data) => {
  let date = getAllDate(data);
  if(date){
    return date[0];
  }
}

const getDateEcheance = (data) => {
  let date = getAllDate(data);
  let str = "Not Found";
  if (date && date[0] != date[date.length - 1]) {
    return date[date.length - 1];
  }else {
    return str;
  }
}

const getDevises = (data) => {
  let ligne = data.split("\n");
  let mot = data.split(" ");
  let devises=[]
  // découpper les textes en des caractéres pour chercher € et $
  for (let i = 0; i< data.length ; i++){
    if (data[i] == "€"){
      devises.push("EUR");
    }
    if (data[i] == "$"){
      devises.push("USD");
    }
  }
  // découpper le texte en des lignes pour chercher les differents mots ci dessous
  for (let i=0; i< ligne.length; i++){
    if (ligne[i] == "EUR" || ligne[i] == "EURO" || ligne[i] == "USD" || ligne[i] == "CHF") {
      devises.push(ligne[i]);
    }
  }
  // découpper le texte en des mots pour chercher les differents mots ci dessous
  for (let i=0; i< mot.length; i++){
    if (mot[i] == "EUR" || mot[i] == "EURO" || mot[i] == "USD" || mot[i] == "CHF") {
      devises.push(mot[i]);
    }
  }
  for(let i =0 ; i < devises.length ; i ++){
    if(devises.length > 1 && devises[i] == "EUR"){
      devises = ["EUR"];
    }
  }
  devises = [...new Set(devises)];

  return devises;
}

const getNumbers = (data) => {
  //console.log(data);

  let montants = []; 
  let number = /[+]?\d*[ ]?\d*\d*\d\.\d\d[\d]?/g;
  let montantsFinal = [];
  let ligne = data.split("\n");
  let dataPointié = [];
  let Data = "";

  for (let i=0; i< ligne.length; i++){
      dataPointié.push(ligne[i].replace(",",".")); 
  }
  Data = dataPointié.toString().replace(/\s+/g, '');
  //console.log("***  "+ Data);

  montants = Data.match(number);

  montants.sort((a, b) => {
    return a - b;
  });
  montants = [...new Set(montants )];

  //console.log("11111111111111111111111111111111111111111111111111111111111111111111 "+montants);
 // here we need to extract only the number without another number or percent after them 
 for (let j = 0; j < montants.length ; j++){
  for (let i = 0; i < ligne.length; i++){
    ligne[i] = ligne[i].replace(/\s+/g, '');
    if (ligne[i].match(montants[j])){
      montantsFinal.push(montants[j]);
       // console.log("22222222222222222222222222222222222222222222222222222222222 "+montantsFinal);
        after = ligne[i].slice((ligne[i].indexOf(montants[j])+ montants[j].length), ligne[i].length);

       // console.log("after==> "+after);
        if (after[0] == "%" || after[0] == "." ){ 
          montantsFinal = montantsFinal.filter(item => item != montants[j]);
          //console.log(montantsFinal);
        }else if (!isNaN(after[0]) && after[1] == "."){
            montantsFinal = montantsFinal.filter(item => item != montants[j]);
        }
    }
  }
 }
  montantsFinal = [...new Set(montantsFinal)];
  return montantsFinal;
}




const getMontants = (data) => {
  let Numbers = getNumbers(data);

  for ( let i = 0 ; i < Numbers.length ; i++){
    if(Numbers.length > 0){
      console.log("Liste des nombres: "+Numbers);
      TTC = Numbers[Numbers.length - 1 ];
      //console.log("TTC= "+ TTC);
        TVA = -1 ;
        HT = -1 ;
        text = data.toString().replace(/\s+/g, '');
        if(Numbers.length > 1){
          a = Numbers.filter(item => item != TTC);
          //console.log("liste without TTC: "+ a);
          for ( let j = a.length ; j >= 0; j--){
            if (Numbers.length > 2){
              b = a.filter(item => item != a[j]);
              console.log("C'est notre deuxieme liste: "+b[j]);
              for ( let k = b.length ; k >= 0; k--){
                if ((TTC - a[j]).toFixed(2) == b[k]){
                  HT = Math.max(a[j], b[k]).toString();
                  TVA = Math.min(a[j], b[k] ).toString();
                  console.log(TTC,HT,TVA,'*********************');
                }
              }
            }
          }
        }
  // if HT is not calculated but TVA is mentioned
        if (HT == -1 && !text.match("HT")){
          a = Numbers.filter(item => item != TTC);
          if(Numbers[i][1].match("^-?\d+(?:\.\d+)$")){
            TVA= round((HT/100)*float(Numbers[i][1])).toFixed(2);
            for (let i = 0; i < a.length ; i++){
              if(abs(TVA - elt) <= 0.04){
                TVA = a[i];
                HT = TTC -TVA;
              }
            }
            console.log(TTC,HT,TVA);
          }
        }
    
  //if no TVA deducted from price
        if (text.match("TVA") && text.match("tax")){
          HT = TTC;
          TVA = "No TVA detected";
        }

    
  }
  //console.log(HT,TVA,TTC);
  return [HT, TVA, TTC];
}
}

const getTypePayement = (data) => {
  let type_pay= [];
  if(data.toLowerCase().match("visa") || data.toLowerCase().match("bancaire") || data.toLowerCase().match("sans constact")){
    type_pay.push("Carte bancaire");
  }else if (data.toLowerCase().match("virement") || data.toLowerCase().match("bic") || data.toLowerCase().match("iban") || data.toLowerCase().match("prelevement") || data.toLowerCase().match("chèque") || data.toLowerCase().match("cheque") || data.toLowerCase().match("check")){
    type_pay.push("Prelèvement");
  }else {
    type_pay.push("Payment type not detected");
  }
  return type_pay;
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
   // if (isProcessed == false){
     // if(category == "Factures Fournisseurs" || category == "Factures Client"){
        const [result] = await client.documentTextDetection("./ndf1.png");
        const detections = result.textAnnotations;
        admin.firestore().collection("posts").doc(postId).update({
          nom_prestataire: detections[0].description.split('\n')[0],
          date_facture: getDate(detections[0].description),
          date_echeance: getDateEcheance(detections[0].description),
          devise: getDevises(detections[0].description),
          //type_tva : getNumbers(detections[0].description),
          montant_ttc : getMontants(detections[0].description)[getMontants(detections[0].description).length - 1],
          montant_tva : getMontants(detections[0].description)[getMontants(detections[0].description).length - 2],
          montant_ht :  getMontants(detections[0].description)[0],
          type_payement : getTypePayement(detections[0].description),
        });
      /*}else if (category == "Note de frais"){
        const [result] = await client.documentTextDetection(imageURL);
        const detections = result.textAnnotations;
        detections.forEach(text => console.log(text.description));
        admin.firestore().collection("posts").doc(postId).update({
          nom_enseigne: detections[0].description.split('\n')[0],
          date : getDate(detections[0].description),
          devise : getDevises(detections[0].description),
          montant_ttc : getMontants(detections[0].description)[getMontants(detections[0].description).length - 1],
          montant_tva : getMontants(detections[0].description)[getMontants(detections[0].description).length - 2],
          montant_ht :  getMontants(detections[0].description)[0],
          type_payement : getTypePayement(detections[0].description),
        });
      }*/
   // }
  });
