import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "../../constants/theme";
import AppButton from "../ui/AppButton";
import AppIconButton from "../ui/AppIconButton";
import AppInput from "../ui/AppInput";

type IncomeFieldsModalProps = {
  visible: boolean;
  fields: string[];
  onClose: () => void;
  onAddField: (fieldName: string) => void;
  onDeleteField: (fieldName: string) => void;
};

export default function IncomeFieldsModal({
  visible,
  fields,
  onClose,
  onAddField,
  onDeleteField,
}: IncomeFieldsModalProps) {
  const [fieldName, setFieldName] = useState("");

  const handleAdd = () => {
    const trimmedFieldName = fieldName.trim();

    if (!trimmedFieldName) {
      Alert.alert("Uyarı", "Lütfen alan adı gir.");
      return;
    }

    onAddField(trimmedFieldName);
    setFieldName("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.title}>Gelir Alanları</Text>

          <Text style={styles.description}>
            SelectBox içinde görünecek alanları ekleyebilir veya silebilirsin.
          </Text>

          <Text style={styles.label}>Yeni Alan Adı</Text>

          <View style={styles.addRow}>
            <AppInput
              value={fieldName}
              onChangeText={setFieldName}
              placeholder="Örn: Prim, Elektrik, Altın"
              height={46}
              style={styles.input}
            />

            <AppButton
              title="Ekle"
              onPress={handleAdd}
              variant="purple"
              width={68}
              height={46}
            />
          </View>

          <Text style={styles.sectionTitle}>Mevcut Alanlar</Text>

          <ScrollView
            style={styles.fieldsScroll}
            contentContainerStyle={styles.fieldsWrapper}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {fields.map((field) => (
              <View key={field} style={styles.fieldItem}>
                <Text style={styles.fieldText}>{field}</Text>

                <AppIconButton
                  icon="trash-outline"
                  onPress={() => onDeleteField(field)}
                  size={38}
                  iconSize={20}
                  iconColor="#fda4af"
                  backgroundColor="rgba(255, 92, 124, 0.18)"
                  borderColor="rgba(255, 92, 124, 0.18)"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              title="Kapat"
              onPress={onClose}
              variant="secondary"
              width={84}
              height={42}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "88%",
    borderRadius: 20,
    backgroundColor: "#030817",
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    padding: 16,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    marginTop: 6,
    color: colors.label,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
  },
  addRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  fieldsScroll: {
    maxHeight: 162,
  },
  fieldsWrapper: {
    gap: 8,
    paddingBottom: 4,
  },
  fieldItem: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: "#060b1b",
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
