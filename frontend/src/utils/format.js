export const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'N/A'; // Retorna "N/A" si el valor es inválido
  return `$${Number(value).toFixed(2)}`; // Formatea el valor como moneda
};