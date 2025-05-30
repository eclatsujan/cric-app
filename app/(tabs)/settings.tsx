import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [syncData, setSyncData] = useState(true);
  const [saveLocally, setSaveLocally] = useState(true);
  const [showExtras, setShowExtras] = useState(true);
  const [showRunRate, setShowRunRate] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      title: "App Settings",
      settings: [
        {
          title: "Push Notifications",
          subtitle: "Receive match updates and alerts",
          value: notifications,
          onToggle: setNotifications,
          icon: "notifications",
        },
        {
          title: "Dark Mode",
          subtitle: "Change app appearance",
          value: darkMode,
          onToggle: setDarkMode,
          icon: "brightness-4",
        },
        {
          title: "Sync Data",
          subtitle: "Keep data synced across devices",
          value: syncData,
          onToggle: setSyncData,
          icon: "sync",
        },
      ],
    },
    {
      title: "Scoring Settings",
      settings: [
        {
          title: "Save Locally",
          subtitle: "Save match data on device",
          value: saveLocally,
          onToggle: setSaveLocally,
          icon: "save",
        },
        {
          title: "Show Extras",
          subtitle: "Display extras in scorecard",
          value: showExtras,
          onToggle: setShowExtras,
          icon: "add-circle-outline",
        },
        {
          title: "Show Run Rate",
          subtitle: "Display current and required run rates",
          value: showRunRate,
          onToggle: setShowRunRate,
          icon: "trending-up",
        },
        {
          title: "Auto Save",
          subtitle: "Automatically save ball-by-ball data",
          value: autoSave,
          onToggle: setAutoSave,
          icon: "save-alt",
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure app preferences</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={`section-${sectionIndex}`} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {section.settings.map((setting, settingIndex) => (
            <View key={`setting-${sectionIndex}-${settingIndex}`} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name={setting.icon} size={24} color="#007bff" />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
              </View>

              <Switch
                value={setting.value}
                onValueChange={setting.onToggle}
                trackColor={{ false: "#e0e0e0", true: "#a2c5f5" }}
                thumbColor={setting.value ? "#007bff" : "#f5f5f5"}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="person" size={24} color="#007bff" />
          <Text style={styles.actionButtonText}>Manage Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="cloud-download" size={24} color="#007bff" />
          <Text style={styles.actionButtonText}>Sync Data</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="help-outline" size={24} color="#007bff" />
          <Text style={styles.actionButtonText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
          <MaterialIcons name="logout" size={24} color="#dc3545" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  section: {
    backgroundColor: "#ffffff",
    marginVertical: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#6c757d",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#dc3545",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#6c757d",
  },
});
