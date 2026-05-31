import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import AppButton from "../ui/AppButton";
import AppIconButton from "../ui/AppIconButton";
import AppInput from "../ui/AppInput";

type IncomeTransactionModalProps = {
  visible: boolean;
  incomeFields: string[];
  onClose: () => void;
  onOpenFieldsModal: () => void;
  onSave: (transaction: Transaction) => void;
};

export default function IncomeTransactionModal({
  visible,
  incomeFields,
  onClose,
  onOpenFieldsModal,
  onSave,
}: IncomeTransactionModalProps) {
  const [selectedField, setSelectedField] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const todayText = useMemo(() => {
    const today = new Date();

    return today.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const resetForm = () => {
    setSelectedField("");
    setIsSelectOpen(false);
    setAmount("");
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOpenFieldsModal = () => {
    setIsSelectOpen(false);
    onOpenFieldsModal();
  };

  const handleSave = () => {
    const parsedAmount = Number(amount.replace(",", "."));

    if (!selectedField) {
      Alert.alert("Uyarı", "Lütfen alan seç.");
      return;
    }

    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Uyarı", "Lütfen geçerli bir tutar gir.");
      return;
    }

    onSave({
      id: Date.now(),
      title: selectedField,
      category: "Gelir",
      amount: parsedAmount,
      type: "income",
      date: todayText,
      note: note.trim() || undefined,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Gelir Ekle</Text>

              <Text style={styles.description}>
                İşlem detaylarını doldur ve kaydet.
              </Text>
            </View>

            <View style={styles.divider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formContent}
            >
              <Text style={styles.label}>Alan</Text>

              <View style={styles.selectWrapper}>
                <View style={styles.selectRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.selectButton,
                      isSelectOpen && styles.selectButtonActive,
                    ]}
                    onPress={() => setIsSelectOpen((current) => !current)}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        !selectedField && styles.placeholderText,
                      ]}
                    >
                      {selectedField || "Seçiniz"}
                    </Text>

                    <Ionicons
                      name={isSelectOpen ? "chevron-up" : "chevron-down"}
                      size={19}
                      color={colors.muted}
                    />
                  </TouchableOpacity>

                  <AppIconButton
                    icon="add"
                    onPress={handleOpenFieldsModal}
                    size={48}
                    iconSize={27}
                    iconColor="#ddd6fe"
                    backgroundColor={colors.purpleSoft}
                    borderColor={colors.purpleBorder}
                  />
                </View>

                {isSelectOpen ? (
                  <View style={styles.dropdown}>
                    <ScrollView
                      style={styles.dropdownScroll}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedField("");
                          setIsSelectOpen(false);
                        }}
                      >
                        <Ionicons
                          name="checkmark"
                          size={19}
                          color={colors.white}
                        />

                        <Text style={styles.dropdownText}>Seçiniz</Text>
                      </TouchableOpacity>

                      {incomeFields.map((field) => (
                        <TouchableOpacity
                          key={field}
                          activeOpacity={0.8}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedField(field);
                            setIsSelectOpen(false);
                          }}
                        >
                          <View style={styles.dropdownIconPlaceholder}>
                            {selectedField === field ? (
                              <Ionicons
                                name="checkmark"
                                size={19}
                                color={colors.income}
                              />
                            ) : null}
                          </View>

                          <Text style={styles.dropdownText}>{field}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.column}>
                  <Text style={styles.label}>Tutar</Text>

                  <AppInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    height={46}
                    style={styles.input}
                  />
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Tarih</Text>

                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{todayText}</Text>

                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={colors.muted}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Not</Text>

              <AppInput
                value={note}
                onChangeText={setNote}
                placeholder="İşlemle ilgili not..."
                height={90}
                multilineInput
                style={styles.noteInput}
              />
            </ScrollView>

            <View style={styles.footer}>
              <AppButton
                title="Vazgeç"
                onPress={handleClose}
                variant="secondary"
                width={84}
                height={42}
              />

              <AppButton
                title="Kaydet"
                onPress={handleSave}
                variant="primary"
                width={100}
                height={42}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
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
  keyboardView: {
    width: "100%",
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    minHeight: 470,
    maxHeight: "92%",
    borderRadius: 22,
    backgroundColor: "#030817",
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    padding: 18,
    zIndex: 10,
    elevation: 10,
  },

  header: {},
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    marginTop: 4,
    color: colors.label,
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.08)",
    marginTop: 12,
    marginBottom: 12,
  },

  formContent: {
    paddingBottom: 4,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  selectWrapper: {
    position: "relative",
    zIndex: 20,
    marginBottom: 12,
  },
  selectRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectButtonActive: {
    borderColor: colors.white,
  },
  selectText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  placeholderText: {
    color: colors.white,
  },

  dropdown: {
    position: "absolute",
    top: 53,
    left: 0,
    right: 56,
    zIndex: 50,
    elevation: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: colors.panel,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 154,
  },
  dropdownItem: {
    minHeight: 36,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownIconPlaceholder: {
    width: 18,
    height: 18,
  },
  dropdownText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  twoColumnRow: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  input: {
    marginBottom: 12,
  },
  dateBox: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 13,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  noteInput: {
    marginBottom: 0,
  },

  footer: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});
