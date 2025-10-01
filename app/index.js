import { View, Text, Button } from "react-native";
import { supabase } from "../lib/supabase";

export default function Home() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>✅ Logado com sucesso!</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}