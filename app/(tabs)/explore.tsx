import { useAuth } from "@/context/AuthConthext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 1. Import the modern hook
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  // 2. Get the safe area values
  const insets = useSafeAreaInsets();

  return (
    // 3. Apply the top inset as padding to the main container
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.content}>
        <Text style={styles.header}>My Cellar Account</Text>

        {isLoggedIn ? (
          <View style={styles.profileBox}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={100} color="#4A0E0E" />
            </View>

            <Text style={styles.userName}>
              {user?.name || "Wine Connoisseur"}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={[styles.statItem, styles.statBorder]}>
                <Text style={styles.statNumber}>4</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color="#4A0E0E" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guestBox}>
            <Ionicons name="wine-outline" size={80} color="#eee" />
            <Text style={styles.guestTitle}>Exclusive Access</Text>
            <Text style={styles.guestText}>
              Sign in to save your favorite vintages and track your premium
              deliveries.
            </Text>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>Sign In / Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.footer, { marginBottom: insets.bottom + 10 }]}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.devText}>
          Designed & Developed by{" "}
          <Text style={styles.devName}>The Scientist</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFCFB" },
  content: { padding: 25 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginBottom: 20,
  },
  profileBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    // High-end shadow for iOS/Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: { marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: "bold", color: "#2C0B0B" },
  userEmail: { fontSize: 16, color: "#888", marginBottom: 25 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 25,
    width: "100%",
    justifyContent: "center",
  },
  statItem: { alignItems: "center", paddingHorizontal: 20 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: "#eee" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#4A0E0E" },
  statLabel: { fontSize: 12, color: "#999", textTransform: "uppercase" },
  logoutBtn: { flexDirection: "row", alignItems: "center", marginTop: 40 },
  logoutText: { color: "#4A0E0E", fontWeight: "bold", marginLeft: 8 },
  guestBox: { alignItems: "center", marginTop: 80 },
  guestTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginTop: 20,
  },
  guestText: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  loginBtn: {
    backgroundColor: "#4A0E0E",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 15,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 20,
  },

  versionText: {
    fontSize: 12,
    color: "#CCC",
    letterSpacing: 1,
    marginBottom: 4,
  },
  devText: {
    fontSize: 14,
    color: "#999",
  },
  devName: {
    fontWeight: "bold",
    color: "#4A0E0E",
  },
});
