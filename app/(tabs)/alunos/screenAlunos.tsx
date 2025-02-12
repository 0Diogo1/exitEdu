import React, { ButtonHTMLAttributes, useEffect } from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-paper'
import styles from '../styles'
import { useData } from '@/src/DataProvider'
import { db } from '@/src/firebase.config'
import { doc, getDoc } from 'firebase/firestore'

const screenAlunos = () => {
  const { aluno } = useData()

  const handleAction = async (id: string, event: GestureResponderEvent) => {
    if (id === 'confirmar') {
      console.log(aluno)
      try {
        if(!aluno?.professor){
          alert('Erro, ID do professor não encontrado');
          return;
        }

        const professorRef = doc(db, 'usuarios', aluno.professor);
        const professorSnap = await getDoc(professorRef);

        if(!professorSnap.exists()){
          alert('Erro: professor não encontrado');
          return;
        }

        const professorData = professorSnap.data();
        const professorPushToken = professorData.pushToken

        if(!professorPushToken){
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
            body: `O aluno ${aluno?.nome} solicitou liberação.`,
            data: { alunoId: aluno?.id },
          }),
        });

        alert('Solicitação enviada')

      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        alert('Erro ao enviar a solicitação');
      }
      
    } else {
      alert('Solicitação cancelada')
    }
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon='account' />
      <View style={styles.groupTextForAluno}>
        <Text variant="titleLarge">Nome: {aluno?.nome}</Text>
        <Text variant="titleLarge">Turma: {aluno?.turma}</Text>
        <Text variant="titleLarge">Horário: {aluno?.horario}</Text>
        <Text variant="titleLarge">professor: {aluno?.professor}</Text>
      </View>
      <View style={styles.groupButtonInRow}>
          <Button mode='outlined' icon='check-bold' 
          onPress={(event) => handleAction('confirmar', event)}>Cornfirmar</Button>
       
          <Button mode='outlined' icon='clock-remove' id='cancelar' 
          onPress={(event) => handleAction('cancelar', event)}>Cancelar</Button>
      </View>
    </View>
  )
}

export default screenAlunos