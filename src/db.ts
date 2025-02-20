import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";



const adicionarDadosAdicionais = (uid: string, nome: string, cargo: string) => {
    const userRef = doc(db, "usuarios", uid); // "usuarios" é o nome da coleção
    setDoc(userRef, {
        nome: nome,
        cargo: cargo
    })
        .then(() => {
            console.log('Cadastro bem sucedido')
        })
        .catch((error) => {
            console.error("Erro ao salvar dados adicionais:", error);
        });
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