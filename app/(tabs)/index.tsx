import { Hero } from "@/components/hero";
import { WebHeader } from "@/components/webHeader";
import { WineCard } from "@/components/WineCard";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Filter, ShoppingCart, XCircle } from "lucide-react-native";
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
  const [sortBy, setSortBy] = useState("default");

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

  const filtereWines = wines
    .filter((item) => {
      const matchesClass =
        activeClass === "All" ||
        (item.class && item.class.toLowerCase() === activeClass.toLowerCase());
      const matchesSub =
        activeSub === "All" ||
        (item.type && item.type.toLowerCase() === activeSub.toLowerCase());

      const matchesSearch = item.name
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : false;

      return matchesClass && matchesSub && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.discount_price ?? a.price;
      const priceB = b.discount_price ?? b.price;

      if (sortBy === "price-low") {
        return priceA - priceB;
      } else if (sortBy === "price-high") {
        return priceB - priceA;
      }
      return 0;
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
        discount_price={item.discount_price}
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
            <ShoppingCart size={24} color="#4A0E0E" />
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
                <View style={styles.searchInputContainer}>
                  <TextInput
                    placeholder="Search for a wine or winery...."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchQuery("")}
                      style={styles.clearButton}
                    >
                      <XCircle size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
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

              {/**Sort ui */}
              <View style={styles.sortContainer}>
                <Filter size={16} color="#999" style={{ marginRight: 8 }} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    onPress={() => setSortBy("default")}
                    style={[
                      styles.sortButton,
                      sortBy === "default" && styles.sortButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === "default" && styles.sortButtonTextActive,
                      ]}
                    >
                      Featured
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSortBy("price-high")}
                    style={[
                      styles.sortButton,
                      sortBy === "price-high" && styles.sortButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === "price-high" && styles.sortButtonTextActive,
                      ]}
                    >
                      € High to Low
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

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
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2C0B0B",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#0E0E0E",
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
    marginTop: 15,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sortButtonActive: {
    backgroundColor: "#4A0E0E",
    borderColor: "#4A0E0E",
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  sortButtonTextActive: { color: "#fff" },
});

export default HomeScreen;
