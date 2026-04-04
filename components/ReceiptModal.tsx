import { CircleCheck } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ReceiptModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
}

export const ReceiptModal = ({
  visible,
  order,
  onClose,
}: ReceiptModalProps) => {
  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.overlay}>
        <View style={styles.paper}>
          <View style={styles.header}>
            <CircleCheck size={50} color="#27ae60" strokeWidth={1.5} />
            <Text style={styles.title}>Payment Confirmed</Text>
            <Text style={styles.orderId}>
              Order ID :{order.id.slice(0, 12).toUpperCase()}
            </Text>
          </View>

          <View style={styles.dash} />

          <ScrollView style={styles.itemList}>
            <Text style={styles.sectionLabel}>Items Purchased</Text>
            {order.items.map((item: any, index: number) => {
              const hasDiscount = item.originalPrice > item.price;
              const percent = hasDiscount
                ? Math.round((1 - item.price / item.originalPrice) * 100)
                : 0;

              return (
                <View key={index} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>
                      {item.quantity}x {item.name}
                    </Text>
                    {hasDiscount && (
                      <Text style={styles.savingsTag}>
                        Promotion applied: -{percent}%
                      </Text>
                    )}
                  </View>
                  <Text style={styles.itemPrice}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.dash}>
            <View style={styles.footer}>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Method</Text>
                <Text style={styles.value}>{order.payment_method}</Text>
              </View>

              {order.total_savings > 0 && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: "#27ae60" }]}>
                    Total Savings
                  </Text>
                  <Text style={[styles.value, { color: "#27ae60" }]}>
                    -€{order.total_savings.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={[styles.row, { marginTop: 10 }]}>
                <Text style={styles.totalLabel}>TOTAL PAID</Text>
                <Text style={styles.totalValue}>
                  €{order.total_amount.toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Back to Boutiques</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#4A0E0E",
    justifyContent: "center",
    padding: 20,
  },
  paper: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 5,
  },
  orderId: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    marginTop: 5,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#bbb",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  dash: {
    borderStyle: "dashed",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginVertical: 15,
  },
  itemList: { maxHeight: 300 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  savingsTag: {
    fontSize: 11,
    color: "#27ae60",
    fontWeight: "bold",
  },
  itemPrice: { fontSize: 15, fontWeight: "bold" },
  footer: { marginTop: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    color: "#777",
    fontSize: 14,
  },
  value: {
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E0E",
  },
  button: {
    backgroundColor: "#4A0E0E",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
