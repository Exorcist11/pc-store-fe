import React from "react";
import {
  CheckCircle,
  Shield,
  Box,
  BatteryCharging,
  FileText,
} from "lucide-react";

const ProductCommitment = () => {
  const commitments = [
    {
      icon: <Box size={24} />,
      title: "Nguyên hộp, đầy đủ phụ kiện",
      description: "Đầy đủ phụ kiện từ nhà sản xuất",
    },
    {
      icon: <BatteryCharging size={24} />,
      title: "Bảo hành pin và bộ sạc",
      description: "Bảo hành 12 tháng",
    },
    {
      icon: <FileText size={24} />,
      title: "Đầy đủ tài liệu",
      description: "Bộ nguồn, máy, sách hướng dẫn sử dụng",
    },
    {
      icon: <Shield size={24} />,
      title: "Bảo hành chính hãng",
      description: "Bảo hành 24 tháng tại trung tâm bảo hành",
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Chính hãng - 1 đổi 1",
      description: "1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6 text-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Cam kết sản phẩm</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commitments.map((commitment, index) => (
          <div key={index} className="flex items-start p-4 border rounded-lg">
            <div className="text-blue-500 mr-3 mt-1">{commitment.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-700">
                {commitment.title}
              </h3>
              <p className="text-sm text-gray-600">{commitment.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700 font-medium">
          Giá sản phẩm đã bao gồm thuế VAT, giúp bạn yên tâm và dễ dàng trong
          việc tính toán chi phí.
        </p>
      </div>
    </div>
  );
};

export default ProductCommitment;
