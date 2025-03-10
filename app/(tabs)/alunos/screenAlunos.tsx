import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-paper'
import styles from '../styles'
import { useData } from '@/src/DataProvider'
import { db } from '@/src/firebase.config'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { Link, useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications';
import { Aluno, Colaborador, ObjectNotification } from '@/src/type'
import { getUserById, getUserId } from '@/src/db'
import Loader from '@/components/Loader/loader'


const screenAlunos = () => {
  const { aluno } = useData()
  const router = useRouter()
  const [response, setResponse] = useState<string>();
  const [colaborador, setColaborador] = useState<Colaborador>()
  const [objectNotification, setObjectNotification] = useState<ObjectNotification>()
  const [loadingNotification, setLoadingNotification] = useState<boolean>(false)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserId();
        if (user) {
          getUserById(user.id).then((user) => {
            setColaborador(user)
          })
        }
      } catch (error) {
        console.error('Erro ao tentar pegar o usuário do scanner', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (aluno && colaborador) {
      setObjectNotification({ aluno, colaborador });
    }
  }, [aluno, colaborador]);


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setResponse(notification.request.content.data.status)
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
      setLoadingNotification(true)
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


        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: professorPushToken,
            title: 'Solicitação de Liberação',
            body: `O aluno ${objectNotification?.aluno.nome} solicitou liberação.`,
            data: { objectNotification },
          }),
        });

        alert('Solicitação enviada')

      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        alert('Erro ao enviar a solicitação');
      } finally {
        setLoadingNotification(false)
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
          {loadingNotification ? (<Loader />) : (
            <View style={styles.groupButtonInRow}>
              <Button mode='outlined' icon='check-bold'
                onPress={(event) => handleAction('confirmar', event)}>Cornfirmar</Button>
              <Button mode='outlined' icon='clock-remove' id='cancelar'
                onPress={(event) => handleAction('cancelar', event)}>Cancelar</Button>
            </View>
          )}
        </>
      ) : (
        <View style={styles.cardContainer}>
          <Text variant='headlineMedium'>{`Solicitação ${response}`}</Text>
          <Link href='/(tabs)/screenScanner/screenScanner'>
            <Button mode='outlined' icon='keyboard-backspace'>QRCode Scanner</Button>
          </Link>


        </View>
      )}

    </View>
  )
}

export default screenAlunos