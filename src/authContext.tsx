import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Colaborador, User } from "./type";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.config";

interface AuthContextType {
    user: User;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ id: '', email: '', token: '', pushToken:'' });
    const [colab, setColab] = useState<Colaborador>({nome:'',cargo:''})
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.replace("/"); // Redireciona para login se não houver usuário
            }
        };

        loadUser();
    }, []);

    const login = async (userData: User) => {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        getColab(userData.id)
        router.replace("/home"); // Redireciona para Home após login
    };

    const logout = async () => {
        await AsyncStorage.removeItem("user");
        setUser({ id: '', email: '', token: '', pushToken:'' });
        router.replace("/"); // Redireciona para login após logout
    };

    const getColab = async (id:string) => {
        try {
              const docRef = doc(db, "usuarios", id);
              const docSnap = await getDoc(docRef);
        
              if (docSnap.exists()) {
                const usuariosData = docSnap.data();
                

              } else {
                
              }
            } catch (err) {
              console.log(err)
            } finally {
            }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);


    if(!context){
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}