import { useAuth } from "@/context/AuthConthext";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.includes("@") || password.length < 8) {
      setErrorMessage(
        "Please enter a valid email and password (min 8 characters)",
      );
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };

  const handleRegister = async () => {
    if (!email.includes("@") || password.length < 8) {
      setErrorMessage(
        "Please enter a valid email and password (min 8 characters)",
      );
      return;
    }

    setIsSubmitting(true);
    await signUp(email, password);
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Login",
          headerTransparent: true,
          headerTintColor: "#4A0E0E",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <ArrowLeft color="#4A0E0E" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign To manage your cellar</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          {showPassword ? (
            <EyeOff size={20} color="#999" />
          ) : (
            <Eye size={20} color="#999" />
          )}
        </TouchableOpacity>
      </View>

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
        style={styles.forgotPassworButton}
        onPress={() => router.push("/forgot-password")}
      >
        <Text style={styles.frogotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister} style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.guestButton}
      >
        <Text style={styles.guestText}>Continue as Guest</Text>
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
  header: { marginBottom: 40 },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A0E0E",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 16, color: "#666", marginTop: 5 },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFCFB",
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#EEE",
    borderWidth: 1,
    height: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#4A0E0E",
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  outlineButton: {
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#4A0E0E",
    marginTop: 12,
  },
  outlineButtonText: {
    color: "#4A0E0E",
    fontWeight: "600",
    fontSize: 18,
  },
  guestButton: {
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },

  guestText: {
    fontWeight: "600",
    color: "#4A0E0E",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
