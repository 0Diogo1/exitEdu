import { Link } from "expo-router";
import { View, StyleSheet, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { Button, Card, Icon, IconButton, PaperProvider, Text } from "react-native-paper";
import { greenTheme } from "@/components/Theme/theme";
import CardButton from "@/components/Buttons/CardButton";
import { useRouter } from "expo-router";

const backgroundImage = require('../../assets/images/backgroundImage.jpg')

const Home = () => {

    const router = useRouter();
    const routeDefiner = (id: string) => {
        if (id === 'registroDeSaida') {
            router.push('/(tabs)/exit/screenRegister')
        } else {
            alert('Tela em desenvolvimento')
        }
    }

    return (
        <PaperProvider theme={greenTheme}>
            <ImageBackground source={backgroundImage} style={styles.background} >
                <View style={styles.container}>
                    <View style={styles.cardRow}>
                        <CardButton icon={"qrcode-scan"} route={() => router.push('/screenScanner/screenScanner')} text={"Scanner"} />
                        <CardButton icon={"human-child"} route={() => router.push('/alunos/screenAlunos')} text={"Alunos"} />
                        <CardButton icon={"office-building-marker"} route={() => routeDefiner('registroDeSaida')} text={"Registro de Saídas"} />
                        <CardButton icon={"file-document-edit"} route={() => routeDefiner('relatorio')} text={"Relatório"} />
                        <CardButton icon={"google-classroom"} route={() => routeDefiner('dalaDeAula')} text={"Sala de aula"} />
                        <CardButton icon={"cellphone-cog"} route={() => routeDefiner('configuracoes')} text={"Configurações"} />
                    </View>
                    <Link style={styles.textColorVariant1} href='/'>voltar</Link>
                </View>
            </ImageBackground>
        </PaperProvider>
    )
}


export default Home;