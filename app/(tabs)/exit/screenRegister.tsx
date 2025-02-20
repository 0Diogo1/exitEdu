import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import styles from '../styles';
import { db } from '@/src/firebase.config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '@/src/authContext';
import { Aluno } from '@/src/type';


const ScreenRegister = () => {
  const [solicitacao, setSolicitacao] = useState<Aluno | null>(null)


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setSolicitacao(notification.request.content.data.aluno)
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      setSolicitacao(response.notification.request.content.data.aluno)
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    }
  }, []);


  const handleResponse = async (status: string) => {
    if (!solicitacao) return;

    try {
      const alunoRef = doc(db, 'solicitacoes', solicitacao.id);
      await setDoc(alunoRef, { status }, { merge: true });

      try {
        const alunoRef = doc(db, 'solicitacoes', solicitacao.id);
        await setDoc(alunoRef, { status }, { merge: true });

        // Enviar notificação para o aluno
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: solicitacao.pushToken,
            title: 'Atualização da Solicitação',
            body: `Sua solicitação foi ${status}.`,
            data: { status },
          }),
        });

        alert(`Você ${status} a saída de ${solicitacao.nome}`);
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Não foi possível atualizar a solicitação');
      }

      alert('Resposta enviada');
      setSolicitacao(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro, não foi possível atualizar a solicitação')
    }
  }

  return (
    <View style={styles.container}>
      {solicitacao ? (
        <View>
          <Card style={styles.groupScreenSaida}>
            <Card.Content style={styles.groupScreenSaida}>
              <Text variant='titleLarge'>Nome: {solicitacao.nome}</Text>
              <Text variant='titleLarge'>Turma: {solicitacao.turma}</Text>
              <Text variant='titleLarge'>Horário: {solicitacao.horario}</Text>
              <View style={styles.buttonSaidaContainer}>
                <Button mode='contained' onPress={() => handleResponse('aprovou')}>Aprovar</Button>
                <Button mode='contained' onPress={() => handleResponse('negou')}>Negar</Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      ) : (
        <Text>Nenhuma solicitação recebida</Text>
      )
      }

    </View >
  );
}
export default ScreenRegister;
