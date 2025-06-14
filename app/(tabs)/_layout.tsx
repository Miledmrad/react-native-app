import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons name="production-quantity-limits" size={24} color="black" />;
}
function TabBarIconTwo(props: {
  name: React.ComponentProps<typeof FontAwesome >['name'];
  color: string;
}) {
  return <FontAwesome name="users" size={24} color="black" />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: ' User Book',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <MaterialCommunityIcons name="format-header-decrease" size={24} color="black" />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Smart Groceries',
          tabBarIcon: ({ color }) => (
            <TabBarIconTwo name="shopping-cart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
