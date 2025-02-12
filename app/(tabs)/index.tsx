import { ImageBackground, Pressable, SafeAreaView, View } from 'react-native';
import { Card, Provider as PaperProvider } from 'react-native-paper';
import EmailInput from '@/components/Inputs/emailInput';
import PasswordInput from '@/components/Inputs/passwordInput';
import { Text } from 'react-native-paper';
import SubmitButton from '@/components/Buttons/SubmitButton';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/firebase.config';
import { greenTheme } from '@/components/Theme/theme';
import { Link, useRouter } from 'expo-router';
import Loader from '@/components/Loader/loader';
import styles from './styles';
import {  useAuth } from '@/src/authContext';

const backGoundImage = require('../../assets/images/cupulaTeatro.jpg')


export default function App() {
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  
  const userLogin = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, userEmail, userPass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = await user.getIdToken()

        let userStorage = {
          token: token,
          id: user.uid,
          email: user.email,
          pushToken:''
        }

        if (user) {
          login(userStorage)
          router.replace('/home')
        }
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      }).finally(() => {
        setLoading(false)
      })
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
                    <Text variant="headlineMedium" style={styles.margin16}>Login</Text>
                    <EmailInput userEmail={userEmail} setEmail={setUserEmail} label={'Email'} />
                    <PasswordInput userPass={userPass} setUserPass={setUserPass} label={'Senha'} />
                    {loading ? <Loader /> : <SubmitButton action={userLogin} text={'Entrar'} />}
                    <View style={styles.boxLink}>
                      <Pressable>
                        <Text style={styles.textColor}>esqueci minha senha</Text>
                      </Pressable>
                      <Pressable>
                        <Link href='/newUser' style={styles.textColor}>novo usuário</Link>
                      </Pressable>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </PaperProvider>

  );
}



