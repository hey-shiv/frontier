import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@frontier/ui-core";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: "#05050F" },
            headerTintColor: "#F0F4FF",
            tabBarStyle: { backgroundColor: "#0B0B16", borderTopColor: "#1E1E2D" },
            tabBarActiveTintColor: colors.blue,
            tabBarInactiveTintColor: "#475569",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Generate",
              tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              title: "Saved",
              tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
            }}
          />
        </Tabs>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
