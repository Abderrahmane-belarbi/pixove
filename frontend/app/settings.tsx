import { useRouter } from "expo-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Shield,
  Trash2,
  User,
  Volume2,
} from "lucide-react-native";
import { Fragment, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SettingItem = {
  icon: any;
  label: string;
  description: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  danger?: boolean;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);

    // TODO: replace with real logout logic
    // await authStore.logout()
    // await SecureStore.deleteItemAsync("token")

    router.replace("/(auth)/login");
  };

  const settingsSections = useMemo<SettingSection[]>(
    () => [
      {
        title: "Account",
        items: [
          {
            icon: User,
            label: "Edit Profile",
            description: "Change your profile information",
            action: () => console.log("Edit Profile"),
          },
          {
            icon: Mail,
            label: "Email",
            description: "sarah.johnson@example.com",
            action: () => console.log("Change Email"),
          },
          {
            icon: Lock,
            label: "Change Password",
            description: "Update your password",
            action: () => console.log("Change Password"),
          },
        ],
      },
      {
        title: "Notifications",
        items: [
          {
            icon: Bell,
            label: "Push Notifications",
            description: "Receive notifications",
            toggle: true,
            value: notificationsEnabled,
            onChange: setNotificationsEnabled,
          },
          {
            icon: Volume2,
            label: "Sound",
            description: "Notification sounds",
            toggle: true,
            value: soundEnabled,
            onChange: setSoundEnabled,
          },
        ],
      },
      {
        title: "Privacy & Security",
        items: [
          {
            icon: Shield,
            label: "Private Account",
            description: "Only followers can see your posts",
            toggle: true,
            value: privateAccount,
            onChange: setPrivateAccount,
          },
          {
            icon: Eye,
            label: "Blocked Accounts",
            description: "Manage blocked users",
            action: () => console.log("Blocked Accounts"),
          },
          {
            icon: Lock,
            label: "Two-Factor Authentication",
            description: "Add extra security",
            action: () => console.log("2FA"),
          },
        ],
      },
      {
        title: "Appearance",
        items: [
          {
            icon: Palette,
            label: "Theme",
            description: "Dark mode",
            action: () => console.log("Theme"),
          },
          {
            icon: Moon,
            label: "Auto Dark Mode",
            description: "Follow system settings",
            action: () => console.log("Auto Dark Mode"),
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            icon: HelpCircle,
            label: "Help Center",
            description: "Get help and support",
            action: () => console.log("Help Center"),
          },
          {
            icon: MessageCircle,
            label: "Contact Us",
            description: "Send us a message",
            action: () => console.log("Contact Us"),
          },
          {
            icon: FileText,
            label: "Terms of Service",
            description: "Read our terms",
            action: () => console.log("Terms"),
          },
          {
            icon: Info,
            label: "About",
            description: "Pixove v1.0.0",
            action: () => console.log("About"),
          },
        ],
      },
      {
        title: "Account Actions",
        items: [
          {
            icon: LogOut,
            label: "Logout",
            description: "Sign out of your account",
            action: () => setShowLogoutModal(true),
          },
          {
            icon: Trash2,
            label: "Delete Account",
            description: "Permanently delete your account",
            action: () => console.log("Delete Account"),
            danger: true,
          },
        ],
      },
    ],
    [notificationsEnabled, privateAccount, soundEnabled],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F11" }}>
      {/* Header */}
      <View
        style={{
          borderBottomColor: "#27272A",
          borderBottomWidth: 1,
          justifyContent: "center",
          marginTop: 24,
          paddingHorizontal: 16,
          height: 60,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 16 }}>Settings</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginTop: 24 }}>
            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 12,
                paddingHorizontal: 24,
                marginBottom: 12,
              }}
            >
              {section.title.toUpperCase()}
            </Text>

            <View
              style={{
                backgroundColor: "rgba(24,24,27,0.5)",
                borderColor: "#27272A",
                borderWidth: 1,
              }}
            >
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;

                return (
                  <Fragment key={itemIndex}>
                    <TouchableOpacity
                      disabled={item.toggle}
                      onPress={item.action}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 16,
                      }}
                    >
                      {/* Left */}
                      <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
                        <Icon
                          size={20}
                          color={item.danger ? "#ef4444" : "#7C3AED"}
                        />
                        <View>
                          <Text
                            style={{
                              color: item.danger ? "#ef4444" : "#fff",
                            }}
                          >
                            {item.label}
                          </Text>
                          <Text style={{ color: "#A1A1AA", fontSize: 12 }}>
                            {item.description}
                          </Text>
                        </View>
                      </View>

                      {/* Right */}
                      {item.toggle ? (
                        <TouchableOpacity
                          onPress={() => item.onChange?.(!item.value)}
                        >
                          <View
                            style={{
                              width: 44,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: item.value
                                ? "#7C3AED"
                                : "#27272A",
                              justifyContent: "center",
                              padding: 2,
                            }}
                          >
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: "#fff",
                                alignSelf: item.value
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <ChevronRight size={18} color="#A1A1AA" />
                      )}
                    </TouchableOpacity>

                    {itemIndex < section.items.length - 1 && (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#27272A",
                          marginLeft: 48,
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <Pressable
          onPress={() => setShowLogoutModal(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#18181B",
              padding: 24,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>
              Logout
            </Text>
            <Text style={{ color: "#A1A1AA", marginBottom: 20 }}>
              Are you sure you want to logout?
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                style={{ flex: 1, alignItems: "center", padding: 12 }}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: "#ef4444",
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
