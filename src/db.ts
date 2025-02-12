import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.config";

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