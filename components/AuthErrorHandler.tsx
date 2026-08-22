import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AuthErrorHandler({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.message}>
          Your session has expired or is invalid. Please log in again.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setHasError(false);
            router.replace("/login");
          }}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4A0E0E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
