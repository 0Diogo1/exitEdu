export interface User {
    id: string;
    email:string | null
    token:string;
    pushToken:string;
}
export interface Aluno {
    id:string;
    nome:string
    turma:string;
    horario:string;
    professor:string;
    pushToken?:string;
}

export interface Colaborador {
    id:string;
    email:string;
    token:string;
    pushToken:string;
}