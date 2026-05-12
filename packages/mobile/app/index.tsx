import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../lib/api";
import type { GenerateInput } from "@frontier/shared";

const SESSION_ID = "mobile-session-v1";

const DOMAINS = ["Machine Learning", "Computer Vision", "NLP", "Agentic AI", "AI Security"];
const EXPERIENCES = ["Beginner", "Intermediate", "Advanced", "Researcher"];

export default function GeneratePage() {
  const [domains, setDomains] = useState<string[]>([]);
  const [experience, setExperience] = useState("Intermediate");
  const [previews, setPreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleDomain = (d: string) => {
    setDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const handleGenerate = async () => {
    if (domains.length === 0) {
      Alert.alert("Select Domains", "Please select at least one AI domain.");
      return;
    }
    setLoading(true);
    try {
      const input: GenerateInput = {
        domains,
        interests: [],
        companies: [],
        experience,
        goal: "Startup",
        timeCommitment: "1 month",
        seed: Date.now(),
      };
      
      const res = await api.generate.previews.$post({ json: input });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setPreviews((data as any).previews || []);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (project: any) => {
    try {
      const res = await api.projects.save.$post({ json: project as any }, { headers: { "x-session-id": SESSION_ID } });
      if (res.ok) {
        Alert.alert("Success", "Project saved to library!");
      } else if (res.status === 409) {
        Alert.alert("Info", "Project already saved.");
      } else {
        throw new Error("Save failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI Project Generator</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Domains</Text>
        <View style={styles.chipRow}>
          {DOMAINS.map((d) => (
            <TouchableOpacity 
              key={d} 
              style={[styles.chip, domains.includes(d) && styles.chipActive]}
              onPress={() => toggleDomain(d)}
            >
              <Text style={[styles.chipText, domains.includes(d) && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience Level</Text>
        <View style={styles.chipRow}>
          {EXPERIENCES.map((e) => (
            <TouchableOpacity 
              key={e} 
              style={[styles.chip, experience === e && styles.chipActive]}
              onPress={() => setExperience(e)}
            >
              <Text style={[styles.chipText, experience === e && styles.chipTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, (domains.length === 0 || loading) && styles.buttonDisabled]} 
        onPress={handleGenerate}
        disabled={domains.length === 0 || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Projects</Text>}
      </TouchableOpacity>

      {previews.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>{previews.length} Previews Generated</Text>
          {previews.map((p, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <TouchableOpacity onPress={() => saveProject(p)}>
                  <Ionicons name="bookmark-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardPitch}>{p.pitch}</Text>
              <View style={styles.tagsRow}>
                <Text style={styles.tag}>{p.difficulty}</Text>
                <Text style={styles.tag}>{p.timeEstimate}</Text>
              </View>
            </View>
          ))}
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F0F4FF",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#94A3B8",
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: "bold",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipActive: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "#3B82F6",
  },
  chipText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#60A5FA",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    color: "#F0F4FF",
    fontWeight: "bold",
    marginBottom: 16,
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
    fontSize: 16,
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
});
