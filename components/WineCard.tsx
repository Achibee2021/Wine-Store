import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WineCardProps {
  id: string;
  name: string;
  winery: string;
  price: number;
  region: string;
  type: string;
  image: string;
}

export const WineCard = ({
  id,
  name,
  winery,
  price,
  region,
  type,
  image,
}: WineCardProps) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = (e: any) => {
    e.stopPropagation(); //Prevents opening the detail screen when clicking '+'
    addToCart({
      id,
      name,
      winery,
      price,
      region,
      type,
      image,
    });
    alert(`${name} added to cart!`);
  };

  const handlePress = () => {
    router.push({
      pathname: "/wine-details",
      params: {
        id,
        name,
        winery,
        price: price.toString(),
        region,
        type,
        image,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.typeTag}>{type.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.winery}>
          {winery} . {region}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    padding: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },
  typeTag: {
    fontSize: 10,
    color: "#8B0000",
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  winery: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  addButton: {
    backgroundColor: "#4A0E0E",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
