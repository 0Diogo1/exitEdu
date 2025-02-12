import SubmitButton from "@/components/Buttons/SubmitButton";
import EmailInput from "@/components/Inputs/emailInput";
import GeneralInput from "@/components/Inputs/generalInput";
import { greenTheme } from "@/components/Theme/theme";
import { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Button, Card, PaperProvider, Text } from 'react-native-paper';
import  styles  from "./styles";
import adicionarDadosAdicionais from "@/src/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase.config";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@/components/Loader/loader";
import PasswordInput from "@/components/Inputs/passwordInput";

const backGoundImage = require('../../assets/images/cupulaTeatro.jpg')

const newUser = () => {
    const [nome, setNome] = useState('')
    const [cargo, setCargo] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaConfirm, setsenhaConfirm] = useState('')
    const [loading, setLoading] = useState(false)

    const newUser = () => {
        if (nome === '' || cargo === '' || email === '' || senha === '' || senhaConfirm === '') {
            alert('Todos os campos devem ser preenchidos');
            return;
        }
        if(senha.length < 6){
            alert('Senha muito curta')
        }
        if (senha !== senhaConfirm) {
            alert('A senhas são diferentes');
            return;
        } else {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, senha)
                .then((userCredential) => {
                    const user = userCredential.user;
                    adicionarDadosAdicionais(user.uid, nome, cargo);
                })
                .then(() => {
                    alert('Usuário cadastrado com sucesso!');
                    router.replace('/');
                })
                .catch((error) => {
                    alert(error.message);
                })
                .finally(() => {
                    setLoading(false); 
                });
        }
    }
    return (
        <PaperProvider theme={greenTheme}>
            <ImageBackground
                source={backGoundImage}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.centerContainer}>
                            <Card>
                                <Card.Content>
                                    <Text variant="headlineMedium" style={styles.margin16}>Novo Usuário</Text>
                                    <GeneralInput input={nome} setInput={setNome} label={'Nome'} />
                                    <GeneralInput input={cargo} setInput={setCargo} label={'Cargo'} />
                                    <EmailInput userEmail={email} setEmail={setEmail} label={'Email'} />
                                    <PasswordInput userPass={senha} setUserPass={setSenha} label={'Senha'} />
                                    <PasswordInput userPass={senhaConfirm} setUserPass={setsenhaConfirm} label={'Confirme a senha'} />
                                    {loading ? <Loader/> : <SubmitButton action={newUser} text={'Cadastrar'} />}
                                    <View style={styles.boxLink}>
                                        <Link href='/' style={styles.textColor}>voltar</Link>
                                    </View>
                                </Card.Content>
                            </Card>
                        </View>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </PaperProvider>
    )
}


export default newUser;