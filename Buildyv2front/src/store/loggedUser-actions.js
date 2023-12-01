import { get, set, ref } from "firebase/database";
import { FirebaseUrls, database } from "../utils/firebaseSetup";
import { loggedUserActions } from "./loggedUser-slice";

export const fetchMyParty = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const dbRef = ref(database, "myParty");
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        throw new Error("Error al obtener los datos.");
      }

      return snapshot.val();
    };

    try {
      const data = await fetchData();
      const firstKey = Object.keys(data)[0];
      const dataObject = data[firstKey];

      dispatch(
        loggedUserActions.setMyParty({
          myPartyId: dataObject.partyId || 0,
          myPartyName: dataObject.partyName || "",
          myPartyImageURL: dataObject.myPartyImageURL || "",
          myPartyColor: dataObject.partyColor || "",
          myUserName: dataObject.userName || "",
          myProvinceId: dataObject.provinceId || 0,
        })
      );
    } catch (error) {
      console.error(`Error al obtener mi partido: ${error}`);
    }
  };
};

export const sendMyParty = (myPartyData) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const dbRef = ref(database, "myParty");
      await set(dbRef, {
        myPartyId: myPartyData.myPartyId || 0,
        myPartyName: myPartyData.myPartyName || "",
        myPartyImageURL: myPartyData.myPartyImageURL || "",
        partyColor: myPartyData.myPartyColor || "",
        userName: myPartyData.userName || "",
        provinceId: myPartyData.provinceId || 0,
      });
    };

    try {
      await sendRequest();
    } catch (error) {
      console.error(`Error al enviar mi partido: ${error}`);
    }
  };
};
