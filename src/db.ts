import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { parseSync } from "@babel/core";
import { Colaborador } from "./type";



const adicionarDadosAdicionais = async (uid: string, nome: string, cargo: string) => {
    try {
        const userRef = doc(db, "usuarios", uid); 
        const { data: pushToken } = await Notifications.getExpoPushTokenAsync();
        setDoc(userRef, {
            nome: nome,
            cargo: cargo,
            pushToken: pushToken
        })
            .then(() => {
                console.log('Cadastro bem sucedido')
            })
            .catch((error) => {
                console.error("Erro ao salvar dados adicionais:", error);
            });
    } catch (error) {
        
    }
}

export default adicionarDadosAdicionais;

export const getUserId = async () => {
   try {
    const userToken = await AsyncStorage.getItem('user');

    if(userToken) {
        const parsedToken = JSON.parse(userToken);
        return parsedToken
       
        
    }

    return null;
   } catch (error) {
    console.error('Eroo ao recuperar o ID do usuário:', error);
    return null;
   }
  };

  export async function getUserById(userId:string): Promise<Colaborador | undefined> {
    const userDocRef = doc(db, "usuarios", userId); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data() as Colaborador;
    } else {
        console.log("Usuário não encontrado!");
        return undefined;
    }
}