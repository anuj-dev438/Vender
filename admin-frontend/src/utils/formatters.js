// Centralized Currency & Date Formatters per coding-standard.md & ruler.md

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString;
};

export const formatPercentage = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${val}%`;
};
