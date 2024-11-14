import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "@/components/context/AuthContext";
import baseUrl from "../../components/services/baseUrl";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { authUser } = useContext(AuthContext);
  const userPhone = authUser?.phone;

  // Using useFocusEffect to trigger fetchTransactions when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactions = async () => {
        try {
          const response = await fetch(
            `${baseUrl}/api/transaction/get-transaction/${userPhone}`
          );
          if (!response.ok) throw new Error("Failed to fetch transactions");
          const data = await response.json();
          setTransactions(data.map((transaction) => ({
            id: transaction._id,
            date: new Date(transaction.createdAt).toLocaleDateString(),
            amount: transaction.amount,
            type: transaction.to === userPhone ? "Credit" : "Debit",
            description: `Transaction ID: ${transaction.transactionId}`,
            transactionType: transaction.tType,
            from: transaction.from,
            to: transaction.to,
          })));
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };

      fetchTransactions();
    }, [userPhone])
  );

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <View style={styles.leftSection}>
          <Text style={styles.transactionType}>{item.transactionType}</Text>
          <Text style={styles.target}>
            {item.type === "Credit" ? `From: ${item.from}` : `To: ${item.to}`}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              item.type === "Credit" ? styles.credit : styles.debit,
            ]}
          >
            {item.type === "Credit" ? `+ $${item.amount}` : `- $${item.amount}`}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    backgroundColor: "#FFD369",
    paddingTop: 25,
    paddingBottom: 10,
  },
  list: {
    flexGrow: 0,
    padding: 16,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  credit: {
    color: "green",
  },
  debit: {
    color: "red",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  transactionType: {
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
  },
  target: {
    fontSize: 16,
    color: "#555",
  },
});

export default Transactions;
