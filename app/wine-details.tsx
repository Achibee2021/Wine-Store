import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function WineDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [wine, setWine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const hasDiscount =
    wine?.discount_price && wine?.discount_price < wine?.price;
  const discountPercent =
    hasDiscount && wine?.price
      ? Math.round(((wine.price - wine.discount_price) / wine.price) * 100)
      : 0;

  const checkIsFavorite = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user?.id)
        .eq("wine_id", wine.id)
        .maybeSingle();

      if (data && !error) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error checking favorite status", err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return alert("Please login to fovorites wines!");
    if (!wine) return;

    const previouslyState = isFavorite;
    setIsFavorite(!previouslyState);

    try {
      if (previouslyState) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user?.id)
          .eq("wine_id", wine.id);
        //setIsFavorite(false);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: user?.id, wine_id: wine.id }]);
        //setIsFavorite(true);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      setIsFavorite(previouslyState);
      alert("Could not update favorites. Please try again");
    }
  };

  useEffect(() => {
    fecthWineDetails();
  }, [id]);

  useEffect(() => {
    if (wine && user) {
      checkIsFavorite();
    }
  }, [wine, user]);

  const fecthWineDetails = async () => {
    const { data, error } = await supabase
      .from("wines")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setWine(data);
    }
    setLoading(false);
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} color="#4A0E0E" />;
  if (!wine) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Wine not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.floatingBackButton}
      >
        <ArrowLeft color="#4A0E0E" size={14} strokeWidth={2.5} />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <Image
          source={{
            uri: wine.image,
          }}
          style={styles.bigImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.region}>{wine.region.toUpperCase()}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{wine.name}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Heart
                fill={isFavorite ? "#8B0000" : "transparent"}
                size={28}
                color={isFavorite ? "#8B0000" : "#4A0E0E"}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            {hasDiscount ? (
              <View>
                <View style={styles.row}>
                  <Text>€{wine.discount_price.toFixed(2)}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{discountPercent}%</Text>
                  </View>
                </View>
                <Text style={styles.detailOriginalPrice}>
                  List Price:{" "}
                  <Text style={styles.strikethrough}>
                    €{wine.price.toFixed(2)}
                  </Text>
                </Text>
              </View>
            ) : (
              <Text style={styles.price}>€{wine.price.toFixed(2)}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About this Wine</Text>
          <Text style={styles.description}>
            {wine.description || "No description avaible for this vintage yet."}
          </Text>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Winery</Text>
          <Text style={styles.description}>{wine.winery}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  bigImage: { width: "100%", height: 300, backgroundColor: "#f9f9f9" },
  content: { padding: 20 },
  region: { color: "#8B0000", fontWeight: "bold", letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 8 },
  price: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, color: "#555", lineHeight: 24 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  priceContainer: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailOriginalPrice: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  badge: {
    backgroundColor: "#4A0E0E",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 15,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
