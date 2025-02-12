import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import styles from '../styles';
import { db } from '@/src/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/src/authContext';


const ScreenRegister = () => {
    const [pushToken, setPushToken] = useState<string | null>(null)
    const {user} = useAuth()

    useEffect(() => {
        const registerForPushNotifications = async () => {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            alert('Permissão para notificações não concedida');
            return;
          }
    
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log('Push token do professor:', token);
          setPushToken(token);
    
          // Salva o token no Firestore
          const professorId = user.id; // Defina o ID do professor corretamente
          const professorRef = doc(db, 'usuarios', professorId);
    
          await setDoc(professorRef, { pushToken: token }, { merge: true });
        };
    
        registerForPushNotifications();
      }, []);

      const handleNotify = async () => {
        console.log("🚀 Botão pressionado! handleNotify chamado");
      
        const { status } = await Notifications.getPermissionsAsync();
        console.log("📌 Status da permissão:", status);
      
        if (status !== 'granted') {
          alert('Você não tem permissão para receber notificações');
          return;
        }
      
        console.log("⏳ Solicitando token do Expo...");
      
        try {
          let tokenResponse = await Notifications.getExpoPushTokenAsync();
          console.log("📢 Resposta do getExpoPushTokenAsync:", tokenResponse);
      
          let { data } = tokenResponse;
          console.log("✅ Token do Expo:", data);
        } catch (error) {
          console.error("❌ Erro ao pegar o token do Expo:", error);
        }
      };

    return (
        <View style={styles.container}>
          <Text>Tela do Professor</Text>
          {/* {pushToken && <Text>Push Token: {pushToken}</Text>} */}
          <Button mode='contained' onPress={handleNotify}>chamar notificação</Button>
        </View>
      );
}
 export default ScreenRegister;
