import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import type { SavedProject } from "@frontier/shared";
import { api } from "../lib/api";

const SESSION_ID = "mobile-session-v1"; // Simple static session ID for mobile demo

export default function SavedPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["saved-projects", SESSION_ID],
    queryFn: async () => {
      const res = await api.projects.saved.$get({}, { headers: { "x-session-id": SESSION_ID } });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.projects.saved[":id"].$delete({ param: { id: id.toString() } }, { headers: { "x-session-id": SESSION_ID } });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => refetch(),
  });

  const projects = data?.projects ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Your Project Library</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : projects.length === 0 ? (
        <Text style={styles.emptyText}>No saved projects yet.</Text>
      ) : (
        projects.map((p: any) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <TouchableOpacity onPress={() => deleteMutation.mutate(p.id)}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardPitch}>{p.pitch}</Text>
            
            <View style={styles.tagsRow}>
              <Text style={styles.tag}>{p.difficulty}</Text>
              <Text style={styles.tag}>{p.timeEstimate}</Text>
              <Text style={styles.tagScore}>Originality: {p.originalityScore}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05050F",
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F0F4FF",
    marginBottom: 20,
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#0B0B16",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#F0F4FF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  cardPitch: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    color: "#94A3B8",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    overflow: "hidden",
  },
  tagScore: {
    color: "#10B981",
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    overflow: "hidden",
  },
});
