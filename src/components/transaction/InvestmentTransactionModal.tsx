import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
import { formatDateTR } from "../../utils/dateUtils";
import AppButton from "../ui/AppButton";
import AppDateField from "../ui/AppDateField";
import AppDatePickerModal from "../ui/AppDatePickerModal";
import AppIconButton from "../ui/AppIconButton";
import AppInput from "../ui/AppInput";

type InvestmentTransactionModalProps = {
  visible: boolean;
  investmentFields: string[];
  editTransaction?: Transaction | null;
  onClose: () => void;
  onOpenFieldsModal: () => void;
  onSave: (transaction: Transaction) => void;
};

const parseTransactionDate = (dateText: string) => {
  const numericDateMatch = dateText.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );

  if (numericDateMatch) {
    const day = Number(numericDateMatch[1]);
    const month = Number(numericDateMatch[2]) - 1;
    const year = Number(numericDateMatch[3]);

    return new Date(year, month, day);
  }

  const parsedDate = new Date(dateText);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date();
};

export default function InvestmentTransactionModal({
  visible,
  investmentFields,
  editTransaction,
  onClose,
  onOpenFieldsModal,
  onSave,
}: InvestmentTransactionModalProps) {
  const [selectedField, setSelectedField] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const selectedDateText = formatDateTR(selectedDate);

  const resetForm = () => {
    setSelectedField("");
    setIsSelectOpen(false);
    setAmount("");
    setNote("");
    setSelectedDate(new Date());
    setIsDatePickerVisible(false);
  };

  useEffect(() => {
    if (!visible) return;

    if (editTransaction) {
      setSelectedField(editTransaction.title);
      setAmount(String(editTransaction.amount));
      setNote(editTransaction.note || "");
      setSelectedDate(parseTransactionDate(editTransaction.date));
      setIsSelectOpen(false);
      setIsDatePickerVisible(false);
      return;
    }

    resetForm();
  }, [visible, editTransaction]);

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
      id: editTransaction?.id ?? Date.now(),
      title: selectedField,
      category: "Yatırım",
      amount: parsedAmount,
      type: "investment",
      date: selectedDateText,
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
              <Text style={styles.title}>
                {editTransaction ? "Yatırım Güncelle" : "Yatırım Ekle"}
              </Text>
              <Text style={styles.description}>
                İşlem detaylarını doldur ve kaydet.
              </Text>
            </View>

            <View style={styles.divider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
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
                      size={18}
                      color={colors.white}
                    />
                  </TouchableOpacity>

                  <AppIconButton
                    icon="add"
                    onPress={handleOpenFieldsModal}
                    size={46}
                    iconSize={22}
                  />
                </View>

                {isSelectOpen ? (
                  <View style={styles.dropdown}>
                    <ScrollView
                      style={styles.dropdownScroll}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedField("");
                          setIsSelectOpen(false);
                        }}
                      >
                        <View style={styles.dropdownIconPlaceholder} />
                        <Text style={styles.dropdownText}>Seçiniz</Text>
                      </TouchableOpacity>

                      {investmentFields.map((field) => (
                        <TouchableOpacity
                          key={field}
                          activeOpacity={0.85}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedField(field);
                            setIsSelectOpen(false);
                          }}
                        >
                          {selectedField === field ? (
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color={colors.investment}
                            />
                          ) : (
                            <View style={styles.dropdownIconPlaceholder} />
                          )}

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
                    keyboardType="numeric"
                    placeholder="0"
                    style={styles.input}
                  />
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Tarih</Text>
                  <AppDateField
                    value={selectedDateText}
                    onPress={() => setIsDatePickerVisible(true)}
                  />
                </View>
              </View>

              <Text style={styles.label}>Not</Text>
              <AppInput
                value={note}
                onChangeText={setNote}
                placeholder="Not gir"
                multilineInput
                height={84}
                textAlignVertical="top"
                style={styles.noteInput}
              />
            </ScrollView>

            <View style={styles.footer}>
              <AppButton
                title="Vazgeç"
                variant="secondary"
                width={92}
                onPress={handleClose}
              />

              <AppButton
                title={editTransaction ? "Güncelle" : "Kaydet"}
                variant="purple"
                width={92}
                onPress={handleSave}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>

      <AppDatePickerModal
        visible={isDatePickerVisible}
        value={selectedDate}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={setSelectedDate}
      />
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
