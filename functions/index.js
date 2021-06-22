const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');
const { info } = require("firebase-functions/lib/logger");


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
  FormatDate1 = /[\d{2}\d{1}] (Janvier|janvier|Février|février|Mars|mars|Avril|avril|Mai|mai|Juin|juin|Juillet|juillet|Aout|aout|Septembre|septembre|Octobre|octobre|Novembre|novembre|Décembre|décembre) \d{4}/gi ;  //dd mois yyyy
  FormatDate2 = /[\d{2}\d{1}] (Jan|jan|Fev|Fév|fév|Mars|Avr|Mai|Jui|Juil|juil|Aout|Sept|Oct|Nov|Dec|Déc) [\d{2}\d{4}]/gi ;  //dd moi yyyy7
  formatDate = /[\d{2}\d{1}]([\/.-])\d{2}\1[\d{2}\d{4}]/g;

  if (data.match(formatDate)) {
    return data.match(formatDate);
  }else if(data.match(FormatDate1)){
    return data.match(FormatDate1);
  }else if (data.match(FormatDate2)) {
    return data.match(FormatDate2);
  }
}

const getDate = (data) => {
  let date = getAllDate(data);
  let str = "Not Found";
  if(date){
    return date[0];
  }
  else{
    return str;
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
    console.log("ligne ==>  " + ligne[i]);
    if (ligne[i].match("EUR") ){
      devises.push(ligne[i].match("EUR"));
    } else if (ligne[i].match("EURO")){
      devises.push(ligne[i].match("EURO"));
    } else if (ligne[i].match("USD")){
      devises.push(ligne[i].match("USD"));
    } else if (ligne[i].match("CHF")){
      devises.push(ligne[i].match("CHF"));
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

  if(montants) {
    montants.sort((a, b) => {
      return a - b;
    });
  }
 
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
     // console.log("Liste des nombres: "+Numbers);
      TTC = Numbers[Numbers.length - 1 ];
      //console.log("TTC= "+ TTC);
        TVA = 0 ;
        HT = 0 ;
        text = data.toString().replace(/\s+/g, '');
        if(Numbers.length > 1){
          a = Numbers.filter(item => item != TTC);
          //console.log("liste without TTC: "+ a);
          for ( let j = a.length ; j >= 0; j--){
            if (Numbers.length > 2){
              b = a.filter(item => item != a[j]);
             // console.log("C'est notre deuxieme liste: "+b[j]);
              for ( let k = b.length ; k >= 0; k--){
                if ((TTC - a[j]).toFixed(2) == b[k]){
                  HT = Math.max(a[j], b[k]).toString();
                  TVA = Math.min(a[j], b[k] ).toString();
                 // console.log(TTC,HT,TVA,'*********************');
                }
              }
            }
          }
        }
//////////////////////////////////////////////////////cette partie à refaire        
  // if HT is not calculated but TVA is mentioned
        if (HT == 0 && !text.match("HT")){
          //console.log("First test");
          a = Numbers.filter(item => item != TTC);
         // console.log(a);
          if(Numbers[i].match("^-?\d+(?:\.\d+)$")){
           // console.log("second test"); 
            TVA= round((HT/100)*float(Numbers[i])).toFixed(2);
            for (let i = 0; i < a.length ; i++){
              if(abs(TVA - elt) <= 0.04){
                TVA = a[i];
                HT = TTC -TVA;
              }
            }
           // console.log(TTC,HT,TVA);
          }
        }
    
  //if no TVA deducted from price
        if (text.match("TVA") && text.match("tax")){
          HT = TTC;
          TVA = "No TVA detected";
        }
/////////////////////////////////////////////////////////////////////////////////////////Jusqu'a la 
    
  }
  //console.log(HT,TVA,TTC);
  return [HT, TVA, TTC];
}
}

const getTypePayement = (data) => {
  let type_pay= [];
  if(data.toLowerCase().match("visa") || data.toLowerCase().match("carte")|| data.toLowerCase().match("bancaire") || data.toLowerCase().match("sans contact")){
    type_pay.push("Carte bancaire");
  }else if (data.toLowerCase().match("virement") || data.toLowerCase().match("bic") || data.toLowerCase().match("iban") || data.toLowerCase().match("prelevement") || data.toLowerCase().match("chèque") || data.toLowerCase().match("cheque") || data.toLowerCase().match("check")){
    type_pay.push("Prelèvement");
  }else {
    type_pay.push("Payment type not detected");
  }
  return type_pay;
}

const getInfoOfPayementOfFacture = (data) => {
  
  const COUNTRY_CODE = {
    'AD': 24, 'AE': 23, 'AT': 20, 'AZ': 28, 'BA': 20, 'BE': 16, 'BG': 22, 'BH': 22, 'BR': 29,
    'CH': 21, 'CR': 21, 'CY': 28, 'CZ': 24, 'DE': 22, 'DK': 18, 'DO': 28, 'EE': 20, 'ES': 24,
    'FI': 18, 'FO': 18, 'FR': 27, 'GB': 22, 'GI': 23, 'GL': 18, 'GR': 27, 'GT': 28, 'HR': 21,
    'HU': 28, 'IE': 22, 'IL': 23, 'IS': 26, 'IT': 27, 'JO': 30, 'KW': 30, 'KZ': 20, 'LB': 28,
    'LI': 21, 'LT': 20, 'LU': 20, 'LV': 21, 'MC': 27, 'MD': 24, 'ME': 22, 'MK': 19, 'MR': 27,
    'MT': 31, 'MU': 30, 'NL': 18, 'NO': 15, 'PK': 24, 'PL': 28, 'PS': 29, 'PT': 25, 'QA': 29,
    'RO': 24, 'RS': 22, 'SA': 24, 'SE': 24, 'SI': 19, 'SK': 24, 'SM': 27, 'TN': 24, 'TR': 26
  };
  type_payement = getTypePayement(data);
  let ligne = data.split("\n");
  let bicFormat = /[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}/g;

  let list_key = [];
  let info = [];
  let iban = "";
  let bic = "";

  for(let key in COUNTRY_CODE) {
    list_key.push(key);
 }

 const hasNumber = (myString) =>{
  return /\d/.test(myString);
}
if (type_payement == "Carte bancaire") {
  for (let i = 0; i < ligne.length ; i++){  
    if (ligne[i].length <= 16 && ligne[i].length > 7){
      if (Number.isInteger(parseInt(ligne[i].slice(-5, ligne[i].length))) && Number.isInteger(parseInt(ligne[i].slice(-9,-5))) == false && !hasNumber((ligne[i].slice(-9,-5)))) {
        info.push(ligne[i]);
      }else {
        info = "NOT FOUND";
      }
    }else {
      info = "NOT FOUND";
    }
  }
} else if (type_payement == "Prelèvement"){
    for (let i = 0; i <list_key.length ; i++){
      for(let j = 0; j < ligne.length ; j++){
        ligne[j] = ligne[j].replace(/\s+/g, '');
        if(ligne[j].slice(0,2) == list_key[i] && Number.isInteger(parseInt(ligne[j].slice(2,4)))){
          iban = ligne[j];
          k = 1;
          // le cas de la facture 2, si les nombres du IBAN sont séparés chacunes dans une ligne
          if ( iban.length < 28 ){
            do{
              iban = iban + " " + ligne[j+k] ;
              k = k + 1 ;
            }while (iban.length < 28 && ligne[j+k].length + iban.length <28);
          }
        }
      }
    }
    for (let i = 0 ; i < ligne.length ; i++){
      if ( ligne[i].match(bicFormat)){
        bic = ligne[i].match(bicFormat);
      }
    }
  }
  return [type_payement, iban, bic];
}

const getInfoOfPayementOfNoteDeFrais = (data) => {
  let ligne = data.split("\n");
  let type_payement = getTypePayement(data);
  //egex that matches Visa, MasterCard, American Express, Diners Club, Discover, and JCB cards
 // let format = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/g;
  let info = [];
  const hasNumber = (myString) =>{
    return /\d/.test(myString);
  }
  if (type_payement == "Carte bancaire") {
    for (let i = 0; i < ligne.length ; i++){  
      if (ligne[i].length <= 16 && ligne[i].length > 7){
        if (Number.isInteger(parseInt(ligne[i].slice(-5, ligne[i].length))) && Number.isInteger(parseInt(ligne[i].slice(-9,-5))) == false && !hasNumber((ligne[i].slice(-9,-5)))) {
          info.push(ligne[i]);
        }else {
          info = "NOT FOUND";
        }
      }else {
        info = "NOT FOUND";
      }
    }
  }
  else {
    info = "NOT FOUND";
  }
  return [type_payement, info];
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
          devise: getDevises(detections[0].description).toString(),
          type_tva : "Pas encore",
          montant_ttc : getMontants(detections[0].description)[2],
          montant_tva : getMontants(detections[0].description)[1],
          montant_ht :  getMontants(detections[0].description)[0],
          type_paiement : getInfoOfPayementOfFacture(detections[0].description)[0].toString(),
          iban : getInfoOfPayementOfFacture(detections[0].description)[1],
          bic : getInfoOfPayementOfFacture(detections[0].description)[2].toString(),
          isProcessed : true,
        });
      }else if (category == "Note de frais"){
        const [result] = await client.documentTextDetection(imageURL);
        const detections = result.textAnnotations;
        admin.firestore().collection("posts").doc(postId).update({
          nom_enseigne: detections[0].description.split('\n')[0],
          date : getDate(detections[0].description),
          devise : getDevises(detections[0].description).toString(),
          montant_ttc : getMontants(detections[0].description)[getMontants(detections[0].description).length - 1],
          montant_tva : getMontants(detections[0].description)[getMontants(detections[0].description).length - 2],
          montant_ht :  getMontants(detections[0].description)[0],
          type_paiement : getInfoOfPayementOfNoteDeFrais(detections[0].description)[0].toString(),
          num_carte_bancaire: getInfoOfPayementOfNoteDeFrais(detections[0].description)[1].toString(),
          type_tva: "Pas encore",
          isProcessed : true,
        });
      }
    }
  });
