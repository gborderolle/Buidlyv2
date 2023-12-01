import { getDatabase, ref, get } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";

// Configuración base
const BASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL;
const JSON_EXTENSION = ".json";

// URLs de Firebase
export const FirebaseUrls = {
  partyClean: `${BASE_URL}/partyList`,
  partyFinal: `${BASE_URL}/partyList${JSON_EXTENSION}`,
  myPartyClean: `${BASE_URL}/myParty`,
  myPartyFinal: `${BASE_URL}/myParty${JSON_EXTENSION}`,
  provinceClean: `${BASE_URL}/provinceList`,
  provinceFinal: `${BASE_URL}/provinceList${JSON_EXTENSION}`,
  municipalityClean: `${BASE_URL}/municipalityList`,
  municipalityFinal: `${BASE_URL}/municipalityList${JSON_EXTENSION}`,
  circuitClean: `${BASE_URL}/circuitList`,
  circuitFinal: `${BASE_URL}/circuitList${JSON_EXTENSION}`,
  slateClean: `${BASE_URL}/slateList`,
  slateFinal: `${BASE_URL}/slateList${JSON_EXTENSION}`,
  candidateClean: `${BASE_URL}/candidateList`,
  candidateFinal: `${BASE_URL}/candidateList${JSON_EXTENSION}`,
  delegadoClean: `${BASE_URL}/delegadoList`,
  delegadoFinal: `${BASE_URL}/delegadoList${JSON_EXTENSION}`,
  userClean: `${BASE_URL}/userList`,
  userFinal: `${BASE_URL}/userList${JSON_EXTENSION}`,
  roleClean: `${BASE_URL}/roleList`,
  roleFinal: `${BASE_URL}/roleList${JSON_EXTENSION}`,
};

// Configuración de Firebase
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicialización condicional de Firebase
let database;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} else {
  database = getDatabase(getApps()[0]); // o usa un índice/nombre específico
}

export { database };

// Función para obtener ID autoincremental
export const getAutoIncrementedId = async (firebaseUrl) => {
  try {
    const relativePath = firebaseUrl
      .split(`${BASE_URL}/`)[1]
      .split(JSON_EXTENSION)[0];
    const dbRef = ref(database, relativePath);
    const snapshot = await get(dbRef);
    const data = snapshot.val();
    return data ? Object.keys(data).length + 1 : 1;
  } catch (error) {
    console.error(`Error al obtener el ID autoincremental: ${error}`);
    return null; // O lanzar un error personalizado
  }
};
