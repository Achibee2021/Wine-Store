import { ReceiptModal } from "@/components/ReceiptModal";
import { WebHeader } from "@/components/webHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    totalPrice,
    totalSavings,
  } = useCart();
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoggedIn, loading, user } = useAuth();
  const [lastOrder, setLastOrder] = useState<any>(null);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to complete your purchase");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: user?.id,
        user_email: user?.email,
        total_amount: totalPrice,
        total_savings: totalSavings,
        items: cart,
        payment_method: paymentMethod,
        status: "completed",
      };
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLastOrder(data);

      setIsProcessing(false);
      setIsPaymentMethod(false);
      setIsSuccess(true);
      clearCart();
      setIsCheckoutStep(false);
    } catch (error: any) {
      alert("Payment failed:" + error.message);
      setIsProcessing(false);
    }
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <ShoppingCart size={80} color="#eee" strokeWidth={1} />
      <Text style={styles.emptyMsg}>Your Cellar is currently empty.</Text>
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.push("/")}
      >
        <Text style={styles.continueText}>Browse our Collections</Text>
      </TouchableOpacity>
    </View>
  );
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => deleteFromCart(item.id)}>
            <Trash2
              size={20}
              color="#999"
              style={{ marginRight: 10 }}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <Text>€{(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => removeFromCart(item.id)}
          style={styles.qtyBtn}
        >
          <Minus size={20} color="#4A0E0E" strokeWidth={1.5} />
        </TouchableOpacity>

        <Text style={styles.qtyText}>{item.quantity}</Text>

        <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtyBtn}>
          <Plus size={20} color="#4A0E0E" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <WebHeader />
      <View
        style={[
          styles.headerRow,
          { paddingTop: Platform.OS === "web" ? 20 : 60 },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            isCheckoutStep ? setIsCheckoutStep(false) : router.back()
          }
          style={styles.backButton}
        >
          {<ArrowLeft size={24} color="#4A0E0E" strokeWidth={1.5} />}
        </TouchableOpacity>
        <Text style={styles.header}>
          {isCheckoutStep ? "Payment" : "Your Wine Cellar"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {!isCheckoutStep ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyCart}
          />

          {cart.length > 0 && (
            <View style={styles.footer}>
              {totalSavings > 0 && (
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: "#27ae60" }]}>
                    Your Savings
                  </Text>
                  <Text style={[styles.totalPrice, { color: "#27ae60" }]}>
                    -€{totalSavings.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total to Pay</Text>
                <Text style={styles.totalPrice}>€{totalPrice.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkOutBtn}
                onPress={() => {
                  if (isLoggedIn) {
                    setIsCheckoutStep(true);
                  } else {
                    router.push("/login");
                  }
                }}
              >
                <Text style={styles.checkOutText}>Proceed to Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.paymentContainer}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {["Credit Card", "OM", "MoMo", "Paypal"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.methodCard,
                paymentMethod === method && styles.methodActive,
              ]}
              onPress={() => {
                (setPaymentMethod(method), setIsPaymentMethod(true));
              }}
            >
              <View>
                {method === "Credit Card" ? (
                  <CreditCard
                    size={24}
                    color={paymentMethod === method ? "#fff" : "#4A0E0E"}
                    strokeWidth={1.5}
                  />
                ) : method === "OM" ? (
                  <Smartphone
                    size={24}
                    color={paymentMethod === method ? "#fff" : "#4A0E0E"}
                    strokeWidth={1.5}
                  />
                ) : method === "MoMo" ? (
                  <Smartphone
                    size={24}
                    color={paymentMethod === method ? "#fff" : "#4A0E0E"}
                    strokeWidth={1.5}
                  />
                ) : (
                  <Wallet
                    size={24}
                    color={paymentMethod === method ? "#fff" : "#4A0E0E"}
                    strokeWidth={1.5}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.methodText,
                  paymentMethod === method && styles.methodTextActive,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.finalSummary}>
            <Text style={styles.summaryText}>
              Total To Pay: €{totalPrice.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={handleCheckout}
              disabled={isProcessing || !isPaymentMethod}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>Confirm & Pay</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ReceiptModal
        visible={isSuccess}
        order={lastOrder}
        onClose={() => {
          setIsSuccess(false);
          router.push("/");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: "#fff",
    width: "100%",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A0E0E",
    textAlign: "center",
  },
  backButton: { padding: 5 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemPrice: { color: "#666", marginTop: 4 },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { padding: 5, backgroundColor: "#f0f0f0", borderRadius: 5 },
  qtyText: { marginHorizontal: 15, fontSize: 16, fontWeight: "bold" },
  emptyContainer: {},
  emptyMsg: { textAlign: "center", marginTop: 50, color: "#999", fontSize: 16 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
    paddingBottom: 30,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: { fontSize: 18, color: "#666" },
  totalPrice: { fontSize: 22, fontWeight: "bold", color: "#4A0E0E" },
  checkOutBtn: {
    backgroundColor: "#4A0E0E",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  checkOutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  continueBtn: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f4f0",
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#4A0E0E",
    fontWeight: "bold",
  },

  paymentContainer: { padding: 20, flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  methodActive: { backgroundColor: "#4A0E0E", borderColor: "#4A0E0E" },
  methodText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#4A0E0E",
    fontWeight: "500",
  },
  methodTextActive: { color: "#fff" },
  finalSummary: { marginTop: "auto", paddingBottom: 30 },
  summaryText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  payBtn: {
    backgroundColor: "#4A0E0E",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
