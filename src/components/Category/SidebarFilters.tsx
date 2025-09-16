"use client";

import { useState } from "react";

// Định nghĩa các kiểu dữ liệu
type FilterState = {
  inStock: boolean;
  promotion: boolean;
  new: boolean;
  priceRange: [number, number];
  brands: Record<string, boolean>;
  categories: Record<string, boolean>;
  processors: Record<string, boolean>;
  rams: Record<string, boolean>;
  storages: Record<string, boolean>;
  graphics: Record<string, boolean>;
};

type ExpandedSections = {
  price: boolean;
  brand: boolean;
  category: boolean;
  processor: boolean;
  ram: boolean;
  storage: boolean;
  graphics: boolean;
};

// Component Checkbox với TypeScript
const Checkbox = ({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
};

// Component Slider với TypeScript
const Slider = ({
  defaultValue,
  max,
  step,
  onValueChange,
  className,
}: {
  defaultValue: [number, number];
  max: number;
  step: number;
  onValueChange: (value: [number, number]) => void;
  className?: string;
}) => {
  const [values, setValues] = useState(defaultValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValues = [...values] as [number, number];
    newValues[index] = Number(e.target.value);
    setValues(newValues);
    onValueChange(newValues);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex space-x-4">
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={values[0]}
          onChange={(e) => handleChange(e, 0)}
          className="w-full"
        />
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={values[1]}
          onChange={(e) => handleChange(e, 1)}
          className="w-full"
        />
      </div>
    </div>
  );
};

// Component Icon với TypeScript
const ChevronDown = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export default function SidebarFilters() {
  const [filters, setFilters] = useState<FilterState>({
    inStock: true,
    promotion: false,
    new: false,
    priceRange: [0, 50000000],
    brands: {
      asus: false,
      dell: false,
      hp: false,
      lenovo: false,
      acer: false,
      apple: false,
      msi: false,
    },
    categories: {
      gaming: false,
      office: false,
      ultrabook: false,
      workstation: false,
      "2-in-1": false,
    },
    processors: {
      intel_i3: false,
      intel_i5: false,
      intel_i7: false,
      intel_i9: false,
      ryzen_3: false,
      ryzen_5: false,
      ryzen_7: false,
      ryzen_9: false,
    },
    rams: {
      ram_4: false,
      ram_8: false,
      ram_16: false,
      ram_32: false,
      ram_64: false,
    },
    storages: {
      hdd: false,
      ssd_256: false,
      ssd_512: false,
      ssd_1t: false,
      ssd_2t: false,
    },
    graphics: {
      integrated: false,
      geforce_mx: false,
      geforce_gtx: false,
      geforce_rtx: false,
      radeon: false,
    },
  });

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    price: true,
    brand: true,
    category: true,
    processor: true,
    ram: true,
    storage: true,
    graphics: false,
  });

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleCheckboxChange = (
    category: keyof Omit<
      FilterState,
      "inStock" | "promotion" | "new" | "priceRange"
    >,
    key: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as Record<string, boolean>)[key],
      },
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const resetFilters = () => {
    setFilters({
      inStock: true,
      promotion: false,
      new: false,
      priceRange: [0, 50000000],
      brands: {
        asus: false,
        dell: false,
        hp: false,
        lenovo: false,
        acer: false,
        apple: false,
        msi: false,
      },
      categories: {
        gaming: false,
        office: false,
        ultrabook: false,
        workstation: false,
        "2-in-1": false,
      },
      processors: {
        intel_i3: false,
        intel_i5: false,
        intel_i7: false,
        intel_i9: false,
        ryzen_3: false,
        ryzen_5: false,
        ryzen_7: false,
        ryzen_9: false,
      },
      rams: {
        ram_4: false,
        ram_8: false,
        ram_16: false,
        ram_32: false,
        ram_64: false,
      },
      storages: {
        hdd: false,
        ssd_256: false,
        ssd_512: false,
        ssd_1t: false,
        ssd_2t: false,
      },
      graphics: {
        integrated: false,
        geforce_mx: false,
        geforce_gtx: false,
        geforce_rtx: false,
        radeon: false,
      },
    });
  };

  return (
    <div className="w-72 space-y-6 shadow p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Bộ lọc sản phẩm</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Đặt lại
        </button>
      </div>

      {/* Tình trạng */}
      <div className="border-b pb-4">
        <h4 className="font-medium mb-2">Tình trạng</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="instock"
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, inStock: checked }))
              }
            />
            <label htmlFor="instock">Còn hàng</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="promotion"
              checked={filters.promotion}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, promotion: checked }))
              }
            />
            <label htmlFor="promotion">Đang giảm giá</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="new"
              checked={filters.new}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, new: checked }))
              }
            />
            <label htmlFor="new">Sản phẩm mới</label>
          </div>
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <h4 className="font-medium">Khoảng giá</h4>
          {expandedSections.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.price && (
          <div className="mt-3">
            <Slider
              defaultValue={filters.priceRange}
              max={50000000}
              step={1000000}
              onValueChange={handlePriceChange}
              className="my-4"
            />
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(filters.priceRange[0])}</span>
              <span>{formatCurrency(filters.priceRange[1])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Thương hiệu */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("brand")}
        >
          <h4 className="font-medium">Thương hiệu</h4>
          {expandedSections.brand ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.brand && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.brands).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${key}`}
                  checked={value}
                  onCheckedChange={() => handleCheckboxChange("brands", key)}
                />
                <label htmlFor={`brand-${key}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danh mục */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("category")}
        >
          <h4 className="font-medium">Danh mục</h4>
          {expandedSections.category ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.category && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.categories).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${key}`}
                  checked={value}
                  onCheckedChange={() =>
                    handleCheckboxChange("categories", key)
                  }
                />
                <label htmlFor={`category-${key}`}>
                  {key === "2-in-1"
                    ? "2-in-1"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bộ vi xử lý */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("processor")}
        >
          <h4 className="font-medium">Bộ vi xử lý</h4>
          {expandedSections.processor ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.processor && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.processors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`processor-${key}`}
                  checked={value}
                  onCheckedChange={() =>
                    handleCheckboxChange("processors", key)
                  }
                />
                <label htmlFor={`processor-${key}`}>
                  {key
                    .replace("_", " ")
                    .toUpperCase()
                    .replace("INTEL", "Intel")
                    .replace("RYZEN", "Ryzen")}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RAM */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("ram")}
        >
          <h4 className="font-medium">RAM</h4>
          {expandedSections.ram ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.ram && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.rams).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`ram-${key}`}
                  checked={value}
                  onCheckedChange={() => handleCheckboxChange("rams", key)}
                />
                <label htmlFor={`ram-${key}`}>
                  {key.replace("ram_", "")} GB
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lưu trữ */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("storage")}
        >
          <h4 className="font-medium">Lưu trữ</h4>
          {expandedSections.storage ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.storage && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.storages).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`storage-${key}`}
                  checked={value}
                  onCheckedChange={() => handleCheckboxChange("storages", key)}
                />
                <label htmlFor={`storage-${key}`}>
                  {key.includes("ssd")
                    ? `SSD ${key.replace("ssd_", "")} GB`
                    : "HDD"}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card đồ họa */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("graphics")}
        >
          <h4 className="font-medium">Card đồ họa</h4>
          {expandedSections.graphics ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.graphics && (
          <div className="space-y-2 mt-3">
            {Object.entries(filters.graphics).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`graphics-${key}`}
                  checked={value}
                  onCheckedChange={() => handleCheckboxChange("graphics", key)}
                />
                <label htmlFor={`graphics-${key}`}>
                  {key === "integrated"
                    ? "Tích hợp"
                    : key === "geforce_mx"
                    ? "GeForce MX"
                    : key === "geforce_gtx"
                    ? "GeForce GTX"
                    : key === "geforce_rtx"
                    ? "GeForce RTX"
                    : "Radeon"}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nút áp dụng (cho mobile) */}
      <div className="lg:hidden flex justify-center mt-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md w-full">
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
}
