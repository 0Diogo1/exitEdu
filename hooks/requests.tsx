import { useAuth } from "@/src/authContext";
import { db } from "@/src/firebase.config";
import { Aluno } from "@/src/type";
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";


const getData = () => {
    const {user} = useAuth()

    const getAluno = () => {
        
    }

    return {
       
    }
}