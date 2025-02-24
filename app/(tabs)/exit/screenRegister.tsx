import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import styles from '../styles';
import { db } from '@/src/firebase.config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Aluno, ObjectNotification } from '@/src/type';


const ScreenRegister = () => {
  const [solicitacao, setSolicitacao] = useState<ObjectNotification | null>(null)


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification.request.content.data);
      setSolicitacao(notification.request.content.data.objectNotification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Resposta da notificação:', response.notification.request.content.data);
      setSolicitacao(response.notification.request.content.data.objectNotification);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('state: ', solicitacao)
  },[solicitacao])


  const handleResponse = async (status: string) => {
    if (!solicitacao) return;

    try {
      const alunoRef = doc(db, 'solicitacoes', solicitacao.aluno.id);
      await setDoc(alunoRef, { status }, { merge: true });

      try {
        const alunoRef = doc(db, 'solicitacoes', solicitacao.aluno.id);
        await setDoc(alunoRef, { status }, { merge: true });

        // Enviar notificação para o aluno
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: solicitacao.colaborador.pushToken,
            title: 'Atualização da Solicitação',
            body: `Sua solicitação foi ${status}.`,
            data: { status },
          }),
        });

        alert(`Você ${status} a saída de ${solicitacao.aluno.nome}`);
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Não foi possível atualizar a solicitação');
      }

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
              <Text variant='titleLarge'>Nome: {solicitacao.aluno.nome}</Text>
              <Text variant='titleLarge'>Turma: {solicitacao.aluno.turma}</Text>
              <Text variant='titleLarge'>Horário: {solicitacao.aluno.horario}</Text>
              <View style={styles.buttonSaidaContainer}>
                <Button mode='contained' onPress={() => handleResponse('aprovada')}>Aprovar</Button>
                <Button mode='contained' onPress={() => handleResponse('negada')}>Negar</Button>
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
