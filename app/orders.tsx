import { useAuth } from "@/context/AuthConthext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || null);
    }
    setLoading(false);
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/**Map through the JSONB 'items' column we saved earlier */}
      {item.items.map((wine: any, index: number) => (
        <Text key={index} style={styles.wineLine}>
          {wine.quantity}x {wine.name}
        </Text>
      ))}

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total Paid:</Text>
        <Text style={styles.totalAmount}>€{item.total_amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#4A0E0E" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
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
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No orders found in your cellar yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E0E",
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  orderId: {
    fontWeight: "bold",
    color: "#666",
  },
  orderDate: {
    color: "#999",
    fontSize: 12,
  },
  wineLine: {
    fontSize: 14,
    color: "#444",
    marginVertical: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: { fontWeight: "600" },
  totalAmount: { fontWeight: "bold", color: "#4A0E0E" },
  empty: { textAlign: "center", marginTop: 100, color: "#999" },
});
