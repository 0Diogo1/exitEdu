import { Stack } from "expo-router";
import { AuthProvider } from "@/src/authContext";
import { StatusBar } from "expo-status-bar";
import { DataProvider } from "@/src/DataProvider";
import { PaperProvider } from "react-native-paper";
import { greenTheme } from "@/components/Theme/theme";

import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {

  useEffect(() => {
    const requestPermission = async () => {
      const {status} =await Notifications.requestPermissionsAsync();
      if(status !== 'granted'){
        alert('Permissão para notificação não consedida');
      };
    }
    requestPermission();
  },[]);
  
  return (
    <AuthProvider>
      <DataProvider>
        <PaperProvider theme={greenTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </DataProvider>
    </AuthProvider>
  );
}
