export interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR';
  reference: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method_type?: string;
  payment_method?: any;
  created_at: string;
  finalized_at?: string;
}

export async function verifyWompiTransaction(
  transactionId: string
): Promise<WompiTransaction | null> {
  try {
    const response = await fetch(
      `https://production.wompi.co/v1/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error al verificar transacción Wompi:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data as WompiTransaction;
  } catch (error) {
    console.error('Error al verificar transacción Wompi:', error);
    return null;
  }
}

export async function getTransactionStatus(
  transactionId: string
): Promise<'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR'> {
  const transaction = await verifyWompiTransaction(transactionId);
  return transaction?.status || 'ERROR';
}
