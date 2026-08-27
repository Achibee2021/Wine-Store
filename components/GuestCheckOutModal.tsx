import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface GuestCheckotModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (guestData: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
  isProcessing: boolean;
}

export function GuestCheckoutModal({
  visible,
  onClose,
  onSubmit,
  isProcessing,
}: GuestCheckotModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    //validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });

    // clear forn after succesful submission
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Send your Order</Text>
          <Text style={styles.subtitle}>
            Enter your details we'll send you an order confirmation
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!isProcessing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!isProcessing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="your phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isProcessing}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isProcessing}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Send Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 10,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 4,
    borderLeftColor: "#D32D2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FDFCFB",
    borderRadius: 12,
    borderColor: "#EEE",
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#4A0E0E",
  },
  cancelButtonText: {
    color: "#4A0E0E",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4A0E0E",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
