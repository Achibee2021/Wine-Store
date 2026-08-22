import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, ChevronRight, Heart } from "lucide-react-native";
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchFavorites();
      }
    }, [user]),
  );

  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `id,
        wines (
        id,
        name,
        price,
        image,
        region,
        winery
        )
        `,
      )
      .eq("user_id", user?.id);

    if (!error) {
      setFavorite(data || []);
    }
    setLoading(false);
  };

  const renderFavoriteItem = ({ item }: { item: any }) => {
    const wine = item.wines;
    return (
      <TouchableOpacity
        style={styles.Card}
        onPress={() =>
          router.push({ pathname: "/wine-details", params: { id: wine.id } })
        }
      >
        <Image source={{ uri: wine.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.wineName}>{wine.name}</Text>
          <Text style={styles.winery}>{wine.winery}</Text>
          <Text style={styles.price}>€{wine.price.toFixed(2)}</Text>
        </View>
        <ChevronRight size={20} color="#CCC" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#4A0E0E" />
        </TouchableOpacity>
        <Text style={styles.title}>My Favorite</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A0E0E"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={favorite}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart size={28} color="#EEE" />
              <Text style={styles.emptyText}>Your wishlist is empty.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E0E",
  },
  Card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  wineName: {
    color: "#2C0B0B",
    fontSize: 16,
    fontWeight: "bold",
  },
  winery: {
    fontSize: 14,
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    paddingTop: 10,
    color: "#4A0E0E",
  },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { fontSize: 16, marginTop: 10, color: "#999" },
});
