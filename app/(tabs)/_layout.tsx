import { Redirect, Tabs, type Href } from "expo-router";

import { useAuth } from "@/lib/json-render/state/auth-context";
import { useTheme } from "@/lib/json-render/theme";
import { TAB_CONFIG, TabIcon } from "@/lib/json-render/tab-config";

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  const { theme } = useTheme();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login" as Href} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.caption,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                family={tab.iconFamily}
                name={focused && tab.activeIcon ? tab.activeIcon : tab.icon}
                size={size}
                color={color}
              />
            ),
            ...(tab.badge ? { tabBarBadge: tab.badge } : {}),
          }}
        />
      ))}
    </Tabs>
  );
}
