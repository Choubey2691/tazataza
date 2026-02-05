/**
 * Calculate delivery fee based on subtotal
 * Business Rule: Free delivery for orders >= ₹99, ₹19 fee for orders < ₹99
 */
export function calculateDeliveryFee(subtotal: number): number {
  return subtotal >= 99 ? 0 : 19;
}

/**
 * Get delivery fee display text
 */
export function getDeliveryFeeDisplay(deliveryFee: number): string {
  return deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`;
}
