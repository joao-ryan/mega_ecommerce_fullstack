export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatInstallments(value: number, installments = 12): string {
  const installmentValue = value / installments;
  return `${installments}x de ${formatCurrency(installmentValue)} sem juros`;
}

export function formatCashDiscount(value: number, discountPercent = 10): string {
  const discounted = value * (1 - discountPercent / 100);
  return `${formatCurrency(discounted)} à vista (${discountPercent}% de desconto no Pix/Boleto)`;
}
