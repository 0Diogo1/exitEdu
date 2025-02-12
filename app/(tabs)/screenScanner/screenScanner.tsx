import { useEffect, useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/src/firebase.config';
import { ActivityIndicator } from 'react-native';
import styles from '../styles';
import { useData } from '@/src/DataProvider';
import { Aluno } from '@/src/type';
import { useRouter } from 'expo-router';

// Caminho da imagem de fundo
const backgroundImage = require('../../../assets/images/backgroundImage.jpg');

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setAluno, aluno} = useData()
  const router = useRouter()

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  

  const handleQrCodeScanned = async ({ data }: { data: string }) => {
    setLoading(true);
    setError(null);

    console.log("📸 QR Code escaneado! ID recebido:", data); // 🔹 Log para verificar se o ID está correto

    try {
      const docRef = doc(db, "aluno", data); // 🔹 Certifique-se de que "aluno" é a coleção correta
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("❌ Documento não encontrado no Firestore!");
        setError("Aluno não encontrado.");
        return;
      }

      console.log("✅ Documento encontrado no Firestore!", docSnap.data()); // 🔹 Exibir dados do aluno no console

      const alunoData = docSnap.data();
      const alunoId = docSnap.id;

      // 🔹 Verifica se os campos existem antes de setar o estado
      if (!alunoData.nome || !alunoData.turma || !alunoData.horario || !alunoData.professor) {
        console.log("⚠️ Dados incompletos no Firestore:", alunoData);
        setError("Dados do aluno estão incompletos no banco.");
        return;
      }

      const alunocomId: Aluno = {
        id: alunoId,
        nome: alunoData.nome,
        turma: alunoData.turma,
        horario: alunoData.horario,
        professor: alunoData.professor,
      };

      setAluno(alunocomId);

      console.log("🚀 Aluno salvo no estado!", alunocomId);
      
    } catch (err) {
      console.error("🔥 Erro ao consultar Firestore:", err);
      setError("Erro ao consultar dados do aluno.");
    } finally {
      setLoading(false);
      router.replace('/(tabs)/alunos/screenAlunos');
    }
  };
  

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleQrCodeScanned} 
        >
        </CameraView>
        <Text style={{color:'white'}}>Aponte a câmera para o QRCODE</Text>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {(scannedData && aluno) &&  (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Nome: {aluno.nome}</Text>
            <Text style={styles.resultText}>Turma: {aluno.turma}</Text>
            <Text style={styles.resultText}>Horário: {aluno.horario}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

