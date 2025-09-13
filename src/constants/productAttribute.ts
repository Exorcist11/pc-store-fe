export const PRODUCT_TYPES = [
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop" },
  { value: "accessory", label: "Phụ kiện" },
];

export const ATTRIBUTE_OPTIONS: Record<string, string[]> = {
  laptop: [
    "Màn hình",
    "CPU",
    "RAM",
    "Ổ cứng",
    "Card đồ họa",
    "Màu sắc",
    "Kích thước màn hình",
    "Độ phân giải",
    "Pin",
    "Trọng lượng",
    "Hệ điều hành",
  ],
  desktop: [
    "CPU",
    "RAM",
    "Ổ cứng SSD",
    "Ổ cứng HDD",
    "Card đồ họa",
    "Bo mạch chủ",
    "Nguồn",
    "Vỏ case",
    "Tản nhiệt",
    "Socket",
    "Chipset",
  ],
  accessory: [
    "Màu sắc",
    "Kích thước",
    "Chất liệu",
    "Kết nối",
    "Tương thích",
    "Bảo hành",
    "Xuất xứ",
    "Model",
  ],
};
