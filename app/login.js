import React from "react";
import { View, Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const handleLoginWithGoogle = async () => {
    const redirectUrl = Linking.createURL("/"); 
    

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("Erro no login:", error);
    } else {
      console.log("Abrindo login Google...");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Entrar com Google" onPress={handleLoginWithGoogle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});