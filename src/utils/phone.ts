// src/utils/phone.ts
export const formatPhoneToE164 = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Assume Kenyan numbers: starts with 0 or 254
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  // If already has '+', return as is
  return phone.startsWith('+') ? phone : `+${cleaned}`;
};