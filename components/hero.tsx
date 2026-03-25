import React from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const Hero = ({ onPress }: { onPress: () => void }) => {
  if (Platform.OS !== "web") return null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506377247377-2a5b3b0ca3ef?auto=format&fit=crop&w=1600&q=80",
        }}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.subtitle}> ESTABLISHED 1924</Text>
          <Text style={styles.title}>
            Experience the Art of {"\n"}Fine Winemaking
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>Explore the Collection</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 450,
    marginBottom: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 60,
    borderRadius: 15,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 10,
    fontWeight: "300",
  },
  title: {
    color: "#fff",
    fontSize: Platform.OS === "web" ? 42 : 32,
    fontWeight: "bold",
    lineHeight: 50,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "flex-start",

    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#4A0E0E",
    fontWeight: "bold",
    fontSize: 16,
  },
});
