export const formatPhoneNumber = (
  rawPhone: string | undefined | null
): string => {
  if (!rawPhone) return "";

  // Loại bỏ tất cả ký tự không phải số
  const digits = rawPhone.replace(/\D/g, "");

  // Nếu bắt đầu bằng +84 hoặc 84 => chuyển về 0
  let normalized = digits;
  if (digits.startsWith("84")) {
    normalized = "0" + digits.slice(2);
  } else if (digits.startsWith("0084")) {
    normalized = "0" + digits.slice(4);
  }

  // Format kiểu 090 123 4567
  return normalized.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
};
