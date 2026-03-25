import { useAuth } from "@/context/AuthConthext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.includes("@") || password.length < 6) {
      alert("Please enter a valid email and password (min 6 characters)");
      return;
    }

    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    await signUp(email, password);
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign To manage your cellar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRegister}
        style={[
          styles.button,
          {
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#4A0E0E",
            marginTop: 10,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: "#4A0E0E" }]}>
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Browsw as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A0E0E",
  },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  button: {
    backgroundColor: "#4A0E0E",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cancel: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});
