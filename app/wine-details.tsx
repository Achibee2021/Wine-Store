import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WineDetailsScreen() {
  const params = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{ title: params.name as string, headerTintColor: "#4A0E0E" }}
      />

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop",
        }}
        style={styles.bigImage}
      />

      <View style={styles.content}>
        <Text style={styles.region}>{params.region}</Text>
        <Text style={styles.title}>{params.name}</Text>
        <Text style={styles.price}>{params.price}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>About this Wine</Text>
        <Text style={styles.description}>
          This premium {params.type} wine from {params.winery} represents the
          best of {params.region}. Perfect for special occasions and fine
          diring.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bigImage: { width: "100%", height: 300, backgroundColor: "#f9f9f9" },
  content: { padding: 20 },
  region: { color: "#8B0000", fontWeight: "bold", letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 8 },
  price: { fontSize: 22, fontWeight: "bold", color: "#1a1a1a" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, color: "#555", lineHeight: 24 },
});
