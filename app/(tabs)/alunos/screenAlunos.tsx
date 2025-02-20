import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-paper'
import styles from '../styles'
import { useData } from '@/src/DataProvider'
import { db } from '@/src/firebase.config'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications';
import { Colaborador, User } from '@/src/type'
import { getUserId } from '@/src/db'

const screenAlunos = () => {
  const { aluno } = useData()
  const router = useRouter()
  const [response, setResponse] = useState<any>();
  const [colaborador, setColaborador] = useState<Colaborador>()


  const fetchUser = async () => {
    try {
      const user = await getUserId();
      if(user){
        setColaborador(user)
      }
    } catch (error) {
      console.error('Erro ao tentar pegar o usuário do scanner', error)
    }
  }
  fetchUser();


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setResponse(notification.request.content.data)
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      setResponse(response.notification.request.content.data.aluno)
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    }
  }, []);

  const handleAction = async (id: string, event: GestureResponderEvent) => {
    if (id === 'confirmar') {
      console.log(aluno)
      try {
        if (!aluno?.professor) {
          alert('Erro, ID do professor não encontrado');
          return;
        }

        const professorRef = doc(db, 'usuarios', aluno.professor);
        const professorSnap = await getDoc(professorRef);

        if (!professorSnap.exists()) {
          alert('Erro: professor não encontrado');
          return;
        }

        const professorData = professorSnap.data();
        const professorPushToken = professorData.pushToken

        if (!professorPushToken) {
          alert('Erro: token de identificação do professor não encontrado');
          return;
        }
        //aqui eu crio o pushtoken e devo salvar e mandar pro banco, depois criar o objeto com aluno e psuhtoken pra mandar pro professor
        const usuarioPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(usuarioPushToken)

        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: professorPushToken,
            title: 'Solicitação de Liberação',
            body: `O aluno ${aluno?.nome} solicitou liberação.`,
            data: { aluno: aluno },
          }),
        });

        alert('Solicitação enviada')

      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        alert('Erro ao enviar a solicitação');
      }

    } else {
      alert('Solicitação cancelada')
      router.push('/(tabs)/screenScanner/screenScanner')
    }
  }

  return (
    <View style={styles.container}>
      {!response ? (
        <>
          <Avatar.Icon size={100} icon='account' />
          <View style={styles.groupTextForAluno}>
            <Text variant="titleLarge">Nome: {aluno?.nome}</Text>
            <Text variant="titleLarge">Turma: {aluno?.turma}</Text>
            <Text variant="titleLarge">Horário: {aluno?.horario}</Text>
          </View>
          <View style={styles.groupButtonInRow}>
            <Button mode='outlined' icon='check-bold'
              onPress={(event) => handleAction('confirmar', event)}>Cornfirmar</Button>
            <Button mode='outlined' icon='clock-remove' id='cancelar'
              onPress={(event) => handleAction('cancelar', event)}>Cancelar</Button>
          </View>
        </>
      ) : (
        <Text>{`reposta: ${response}`}</Text>
      )}

    </View>
  )
}

export default screenAlunos