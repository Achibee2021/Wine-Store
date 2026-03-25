import { Hero } from "@/components/hero";
import { WebHeader } from "@/components/webHeader";
import { WineCard } from "@/components/WineCard";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
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
  const { width } = Dimensions.get("window");
  const flatListRef = React.useRef<FlatList>(null);

  const numColumns = width > 1100 ? 3 : width > 700 ? 2 : 1;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [activeClass, setActiveClass] = useState("All");
  const [activeSub, setActiveSub] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [wines, setWines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch wines
  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("wines").select("*");

      if (error) {
        throw error;
      }
      if (data) {
        setWines(data);
      }
    } catch (error: any) {
      alert("Error loading cellar:" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filtereWines = wines.filter((item) => {
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
    <View
      style={{
        flex: 1 / numColumns,
        padding: 10,
        minWidth: Platform.OS === "web" ? 280 : "auto",
      }}
    >
      <WineCard
        id={item.id}
        name={item.name}
        winery={item.winery}
        price={item.price}
        region={item.region}
        type={item.type}
        image={item.image}
      />
    </View>
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

  const scrollToCellar = () => {
    flatListRef.current?.scrollToOffset({
      offset: Platform.OS === "web" ? 460 : 0,
      animated: true,
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A0E0E" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Opening the Cellar...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <WebHeader />
      ) : (
        <View style={[styles.headerRow, { paddingTop: insets.top + 10 }]}>
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
      )}

      {/**FlatList */}
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={
          <View style={styles.listHeaderInner}>
            <Hero onPress={scrollToCellar} />
            <View style={styles.controlsContainer}>
              {/** The Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search for a wine or winery...."
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
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
                      style={[
                        styles.subTab,
                        activeSub === sub && styles.subTabActive,
                      ]}
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

              <Text style={styles.sectionTitle}>Our Vintage</Text>
            </View>
          </View>
        }
        data={filtereWines}
        key={numColumns}
        numColumns={numColumns}
        renderItem={renderWineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
  },
  listHeaderInner: {
    backgroundColor: "#fff",
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A0E0E",
    marginVertical: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C0B0B",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },

  searchInput: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
  },

  mainTabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
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
    fontSize: 16,
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
  subTabActive: { backgroundColor: "#4A0E0E" },
  subTabText: { fontSize: 13, color: "#666" },
  subTabTextActive: { color: "#fff" },
  sectionHeader: { paddingHorizontal: 20, marginVertical: 20 },

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
