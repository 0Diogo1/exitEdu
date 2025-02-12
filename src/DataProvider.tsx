import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Aluno, Colaborador } from "./type";

interface DataContextType {
    aluno: Aluno | null;
    colab: Colaborador;
    setAluno: Dispatch<SetStateAction<Aluno | null>>;
    setColab: Dispatch<SetStateAction<Colaborador>>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [aluno, setAluno] = useState<Aluno | null>(null)
    const [colab, setColab] = useState<Colaborador>({ nome: '', cargo: '' })

    return (
        <DataContext.Provider value={{ aluno, setAluno, colab, setColab }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataContext);


    if (!context) {
        throw new Error('dadosContext deve ser usado dentro de um dadosProvider')
    }
    return context
}