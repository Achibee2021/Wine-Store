import { useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Check, Eye, EyeOff, Lock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { updatePassword } = useAuth();
  const router = useRouter();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    {
      label: "Contains special character",
      met: /[@#$%^&*!.,?":{}|<>]/.test(password),
    },
  ];

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    if (!allRequirementsMet) {
      setErrorMessage("Password does not meet all requirements");
      return;
    }

    if (password != confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updatePassword(password);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#4A0E0E",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color="#4A0E0E" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Lock color="#4A0E0E" size={32} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Please create a new secure password for your Account
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.requirementsContainer}>
        {passwordRequirements.map((req, index) => (
          <View key={index} style={styles.requirementItem}>
            <View
              style={[
                styles.requirementIcon,
                req.met && styles.requirementIconMet,
              ]}
            >
              {req.met && <Check size={12} color="#fff" strokeWidth={3} />}
            </View>
            <Text
              style={[
                styles.requirementText,
                req.met && styles.requirementTextMet,
              ]}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder=" new Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          editable={!isSubmitting}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          editable={!isSubmitting}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          {showConfirmPassword ? (
            <EyeOff size={20} color="#999" />
          ) : (
            <Eye size={20} color="#999" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
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
  backButton: {
    marginLeft: 10,
    padding: 5,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FDF0EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A0E0E",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },

  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
  requirementsContainer: {
    backgroundColor: "#FDFCFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  requirementIconMet: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  requirementText: {
    fontSize: 13,
    color: "#999",
  },
  requirementTextMet: {
    color: "#4CAF50",
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
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  eyeIcon: {
    padding: 5,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
