import { useState } from "react";

import { defaultExpenseFields } from "../data/expenseFields";
import { defaultIncomeFields } from "../data/incomeFields";
import { defaultInvestmentFields } from "../data/investmentFields";

const addUniqueField = (fields: string[], fieldName: string) => {
  const isAlreadyExists = fields.some(
    (field) => field.toLowerCase() === fieldName.toLowerCase(),
  );

  if (isAlreadyExists) {
    return fields;
  }

  return [...fields, fieldName];
};

const deleteField = (fields: string[], fieldName: string) => {
  return fields.filter((field) => field !== fieldName);
};

export const useTransactionFields = () => {
  const [incomeFields, setIncomeFields] =
    useState<string[]>(defaultIncomeFields);

  const [expenseFields, setExpenseFields] =
    useState<string[]>(defaultExpenseFields);

  const [investmentFields, setInvestmentFields] = useState<string[]>(
    defaultInvestmentFields,
  );

  const handleAddIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) => deleteField(currentFields, fieldName));
  };

  const handleAddExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) => deleteField(currentFields, fieldName));
  };

  const handleAddInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) =>
      deleteField(currentFields, fieldName),
    );
  };

  return {
    incomeFields,
    expenseFields,
    investmentFields,
    handleAddIncomeField,
    handleDeleteIncomeField,
    handleAddExpenseField,
    handleDeleteExpenseField,
    handleAddInvestmentField,
    handleDeleteInvestmentField,
  };
};
