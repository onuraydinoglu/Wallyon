import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function OnboardingScreen() {
  const [name, setName] = useState("");

  const handleStart = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert("Uyarı", "Lütfen ismini gir.");
      return;
    }

    router.replace({
      pathname: "/tabs/home",
      params: {
        name: trimmedName,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="mb-3 text-4xl font-bold text-slate-950">
          Hoş Geldin
        </Text>

        <Text className="mb-10 text-base leading-6 text-slate-500">
          Uygulamaya başlamak için sadece ismini girmen yeterli.
        </Text>

        <Text className="mb-2 text-sm font-semibold text-slate-700">İsmin</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Örn: Onur"
          placeholderTextColor="#94a3b8"
          className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900"
        />

        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.8}
          className="rounded-2xl bg-red-500 py-4"
        >
          <Text className="text-center text-base font-bold text-white">
            Başla
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
