import { WineCard } from "@/components/WineCard";
import { WINE_DATA } from "@/constants/Wines";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAIN_CLASSES = ["All", "Wine", "Champagne"];
const SUB_TYPES = {
  All: [],
  Wine: ["All", "Red", "White", "Rose", "Sparkling"],
  Champagne: ["All", "Brut", "Rose", "Vintage"],
};

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [activeClass, setActiveClass] = useState("All");
  const [activeSub, setActiveSub] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtereWines = WINE_DATA.filter((item) => {
    const matchesClass = activeClass === "All" || item.class === activeClass;
    const matchesSub = activeSub === "All" || item.type === activeSub;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesClass && matchesSub && matchesSearch;
  });

  const handleClassChange = (newClass: string) => {
    setActiveClass(newClass);
    setActiveSub("All");
  };

  // function to shows how ONE wine card should be
  const renderWineItem = ({ item }: { item: any }) => (
    <WineCard
      id={item.id}
      name={item.name}
      winery={item.winery}
      price={item.price}
      region={item.region}
      type={item.type}
      image={item.image}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No bottles found in this cellar.....</Text>
      <TouchableOpacity
        onPress={() => {
          setSearchQuery("");
          setActiveClass("All");
        }}
      >
        <Text style={styles.resetLink}>Clear all filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Wine Store</Text>

        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={28} color="#4A0E0E" />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/** The Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for a wine or winery...."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/** TOP LEVEL: Wine vs Champagne */}
      <View style={styles.mainTabRow}>
        {MAIN_CLASSES.map((cls) => (
          <TouchableOpacity
            key={cls}
            onPress={() => handleClassChange(cls)}
            style={[
              styles.mainTab,
              activeClass === cls && styles.mainTabActive,
            ]}
          >
            <Text
              style={[
                styles.mainTabText,
                activeClass === cls && styles.mainTabTextActive,
              ]}
            >
              {cls}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/** SUB LEVEL */}
      {activeClass !== "All" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subScroll}
        >
          {(SUB_TYPES as any)[activeClass].map((sub: string) => (
            <TouchableOpacity
              key={sub}
              onPress={() => setActiveSub(sub)}
              style={[styles.subTab, activeSub === sub && styles.subTabActive]}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSub === sub && styles.subTabTextActive,
                ]}
              >
                {sub}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/**FlatList */}
      <FlatList
        data={filtereWines}
        renderItem={renderWineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFCFB" },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 10,
    color: "#2C0B0B",
  },
  mainTabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mainTab: {
    paddingBottom: 10,
    marginRight: 25,
  },
  mainTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#4A0E0E",
  },
  mainTabText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "600",
  },
  mainTabTextActive: { color: "#4A0E0E" },
  subScroll: {
    paddingLeft: 20,
    marginVertical: 10,
    maxHeight: 50,
  },
  subTab: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  subTabActive: { backgroundColor: "4A0E0E" },
  subTabText: { fontSize: 13, color: "#666" },
  subTabTextActive: { color: "#fff" },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 10,
  },
  resetLink: {
    fontSize: 16,
    color: "#4A0E0E",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginTop: 10,
  },
  cartIconContainer: {
    position: "relative",
    padding: 5,
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "#B22222",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HomeScreen;
