import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const WebHeader = () => {
  const router = useRouter();
  const { cart } = useCart();
  const pathname = usePathname();
  const { width } = Dimensions.get("window");
  const isMobileWeb = width < 600;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (Platform.OS !== "web") return null;

  return (
    <View style={[styles.webNav, { paddingHorizontal: isMobileWeb ? 15 : 60 }]}>
      <TouchableOpacity onPress={() => router.push("/")} activeOpacity={0.7}>
        <Text style={[styles.webLogo, { fontSize: isMobileWeb ? 18 : 22 }]}>
          WEIN STORE
        </Text>
      </TouchableOpacity>

      <View style={[styles.webLinks, { gap: isMobileWeb ? 15 : 40 }]}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text
            style={[
              styles.navLink,
              pathname === "/" && styles.activeLink,
              isMobileWeb && { fontSize: 14 },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/explore")}>
          <Text
            style={[
              styles.navLink,
              pathname === "/explore" && styles.activeLink,
              isMobileWeb && { fontSize: 14 },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={styles.cartBtnWeb}
        >
          <Ionicons name="cart" size={16} color="#fff" />
          <Text
            style={[styles.cartBtnText, { fontSize: isMobileWeb ? 12 : 14 }]}
          >
            ({totalItems})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 1000,
    position: Platform.OS === "web" ? "sticky" : "relative",
    top: 0,
    width: "100%",
  },

  webLogo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A0E0E",
    letterSpacing: 2,
  },
  webLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  navLink: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  activeLink: {
    color: "#4A0E0E",
    fontWeight: "700",
  },
  cartBtnWeb: {
    backgroundColor: "#4A0E0E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  cartBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
