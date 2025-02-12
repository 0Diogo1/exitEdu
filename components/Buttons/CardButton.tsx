import { View } from "react-native"
import { Card, IconButton, Text } from "react-native-paper"
import styles from "@/app/(tabs)/styles"

interface CardButtonProps {
    icon:string;
    text:string;
    route:() => void;
}

const CardButton:React.FC<CardButtonProps> = ({icon, route, text}) => {
    return (
        <Card onPress={route}>
            <Card.Content>
                <View style={styles.buttonContainer}>
                    <IconButton
                        icon={icon}
                        size={50}
                        iconColor="purple"
                    />
                    <Text style={styles.buttonText}>{text}</Text>
                </View>
            </Card.Content>
        </Card>
    )
}

export default CardButton;