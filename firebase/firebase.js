import * as firebase from "firebase";
import firebaseConfig from "./config";
require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

export async function addFacturesClient(
  title,
  category,
  subCategory,
  localUri
) {
  const remoteUri = await uploadPhotoAsync(localUri, `facturesClient/${title}`);
  let isProcessed = false;
  let isCheckedByUser = false;

  return new Promise((res, rej) => {
    firestore()
      .collection("posts")
      .add({
        idUser: idUser(),
        timestamp: timestamp(),
        title: title,
        class: category,
        subClass: subCategory,

        nom_prestataire: "",
        date_facture: "",
        date_echeance: "",
        devise: "",
        montant_ttc: "",
        montant_ht: "",
        montant_tva: "",
        type_tva: "",
        type_paiement: "",
        iban: "",
        bic: "",

        isProcessed: isProcessed,
        isCheckedByUser: isCheckedByUser,
        url: remoteUri,
      })
      .then((ref) => {
        res(ref);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export async function addFacturesFournisseurs(
  title,
  category,
  subCategory,
  localUri
) {
  const remoteUri = await uploadPhotoAsync(
    localUri,
    `facturesFournisseurs/${title}`
  );
  let isProcessed = false;
  let isCheckedByUser = false;

  return new Promise((res, rej) => {
    firestore()
      .collection("posts")
      .add({
        idUser: idUser(),
        timestamp: timestamp(),
        title: title,
        class: category,
        subClass: subCategory,

        nom_prestataire: "",
        date_facture: "",
        date_echeance: "",
        devise: "",
        montant_ttc: "",
        montant_ht: "",
        montant_tva: "",
        type_tva: "",
        type_paiement: "",
        iban: "",
        bic: "",

        isProcessed: isProcessed,
        isCheckedByUser: isCheckedByUser,
        url: remoteUri,
      })
      .then((ref) => {
        res(ref);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export async function addNotesDeFrais(title, category, subCategory, localUri) {
  const remoteUri = await uploadPhotoAsync(localUri, `notesdefrais/${title}`);
  let isProcessed = false;
  let isCheckedByUser = false;

  return new Promise((res, rej) => {
    firestore()
      .collection("posts")
      .add({
        idUser: idUser(),
        timestamp: timestamp(),
        title: title,
        class: category,
        subClass: subCategory,

        nom_enseigne: "",
        date: "",
        devise: "",
        montant_ttc: "",
        montant_ht: "",
        montant_tva: "",
        type_tva: "",
        type_paiement: "",
        num_carte_bancaire: "",

        isProcessed: isProcessed,
        isCheckedByUser: isCheckedByUser,
        url: remoteUri,
      })
      .then((ref) => {
        res(ref);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export async function addAutres(title, category, subCategory, localUri) {
  const remoteUri = await uploadPhotoAsync(localUri, `autres/${title}`);
  let isProcessed = false;
  let isCheckedByUser = false;

  return new Promise((res, rej) => {
    firestore()
      .collection("posts")
      .add({
        idUser: idUser(),
        timestamp: timestamp(),
        title: title,
        class: category,
        subClass: subCategory,

        isProcessed: isProcessed,
        isCheckedByUser: isCheckedByUser,
        url: remoteUri,
      })
      .then((ref) => {
        res(ref);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export async function uploadPhotoAsync(uri, filename) {
  return new Promise(async (res, rej) => {
    const response = await fetch(uri);
    const file = await response.blob();

    let upload = firebase.storage().ref(filename).put(file);

    upload.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        rej(err);
      },
      async () => {
        const url = await upload.snapshot.ref.getDownloadURL();
        res(url);
      }
    );
  });
}

export function firestore() {
  return firebase.firestore();
}

export function idUser() {
  return (firebase.auth().currentUser || {}).uid;
}

export function timestamp() {
  return Date.now();
}
