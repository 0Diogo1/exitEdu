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
}

export interface Colaborador {
    nome:string,
    cargo:string,
    pushToken:string
}
export interface ObjectNotification {
    aluno:Aluno,
    colaborador:Colaborador
}