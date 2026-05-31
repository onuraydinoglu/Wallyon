import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  return (
    <View className="flex-1 bg-[#061426] px-6 pt-16">
      <Text className="text-lg text-white">Hello,</Text>

      <Text className="mb-8 text-3xl font-bold text-white">
        Welcome Back{name ? `, ${name}` : ""}!
      </Text>

      <View className="rounded-3xl bg-red-500 p-6">
        <Text className="mb-4 text-base text-white/80">Total Balance</Text>

        <Text className="text-4xl font-bold text-white">$ 24,560.00</Text>

        <Text className="mt-8 text-base text-white/80">
          **** **** **** 4568
        </Text>
      </View>

      <View className="mt-6 flex-row justify-between">
        <View className="h-24 w-[22%] items-center justify-center rounded-2xl bg-white">
          <Text className="font-semibold text-slate-900">Send</Text>
        </View>

        <View className="h-24 w-[22%] items-center justify-center rounded-2xl bg-white">
          <Text className="font-semibold text-slate-900">Receive</Text>
        </View>

        <View className="h-24 w-[22%] items-center justify-center rounded-2xl bg-white">
          <Text className="font-semibold text-slate-900">Top Up</Text>
        </View>

        <View className="h-24 w-[22%] items-center justify-center rounded-2xl bg-white">
          <Text className="font-semibold text-slate-900">More</Text>
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-slate-900">
            Recent Transactions
          </Text>

          <Text className="font-semibold text-red-500">See All</Text>
        </View>

        <Text className="mb-4 text-base font-semibold text-slate-900">
          Dribbble -$250.00
        </Text>

        <Text className="mb-4 text-base font-semibold text-slate-900">
          Figma -$160.00
        </Text>

        <Text className="text-base font-semibold text-slate-900">
          Upwork +$850.00
        </Text>
      </View>
    </View>
  );
}
