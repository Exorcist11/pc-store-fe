"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

interface ProductRecommendation {
  productName: string;
  productSlug: string;
  variantSku: string;
  price: number;
  discount: number;
  finalPrice: number;
  attributes: Record<string, string>;
  reason: string;
  pros: string[];
  cons: string[];
  valueScore: number;
}

interface BotResponseData {
  success: boolean;
  data: {
    userQuery: string;
    totalProductsFound: number;
    recommendations: {
      summary: string;
      recommendations: ProductRecommendation[];
      advice: string;
    };
  };
}

interface Message {
  type: "bot" | "user";
  content: string | BotResponseData;
  timestamp: Date;
}

export default function ProductChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý ảo. Hãy cho tôi biết bạn đang tìm kiếm sản phẩm gì nhé! 😊",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock response - replace with actual API call to BotResponseData
      const mockResponse = {
        success: true,
        data: {
          userQuery: inputValue,
          totalProductsFound: 1,
          recommendations: {
            summary:
              "Khách hàng đang tìm kiếm RAM cho máy tính. Dựa trên thông tin hiện có, tôi đề xuất RAM PC Kingston Fury Beast Black 16GB 3200MHz DDR4 KF432C16BB1/16.",
            recommendations: [
              {
                productName:
                  "RAM PC Kingston Fury Beast Black 16GB 3200MHz DDR4 KF432C16BB1/16",
                productSlug:
                  "ram-pc-kingston-fury-beast-black-16gb-3200mhz-ddr4-kf432c16bb116",
                variantSku: "KF432C16BB1",
                price: 1290000,
                discount: 0,
                finalPrice: 1290000,
                attributes: {
                  "Kết nối": "DIMM (PC, Desktop)",
                  "Bus RAM": "3200MHz",
                  "Dung lượng": "16GB",
                  "Loại RAM": "DDR4",
                },
                reason:
                  "RAM Kingston Fury Beast Black 16GB là một lựa chọn tốt cho người dùng muốn nâng cấp bộ nhớ.",
                pros: [
                  "Dung lượng 16GB đủ cho nhiều tác vụ",
                  "Tốc độ bus 3200MHz giúp tăng hiệu năng",
                  "Giá cả phải chăng",
                  "Thương hiệu uy tín",
                ],
                cons: [],
                valueScore: 9,
              },
            ],
            advice:
              "Trước khi mua, hãy kiểm tra xem bo mạch chủ của bạn có hỗ trợ RAM DDR4 3200MHz không.",
          },
        },
      };

      const botMessage: Message = {
        type: "bot",
        content: mockResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const renderBotResponse = (data: BotResponseData) => {
    if (!data.success || data.data.totalProductsFound === 0) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            Không tìm thấy sản phẩm phù hợp trong hệ thống.
          </p>
          <p className="text-red-600 text-sm mt-2">
            Vui lòng thử lại với từ khóa khác hoặc liên hệ nhân viên hỗ trợ.
          </p>
        </div>
      );
    }

    const { recommendations } = data.data;

    return (
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-800 text-sm">{recommendations.summary}</p>
        </div>

        {/* Product Recommendations */}
        {recommendations.recommendations.map((product, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
              {product.productName}
            </h4>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              {product.discount > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-red-600 font-bold text-lg">
                {formatPrice(product.finalPrice)}
              </span>
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.entries(product.attributes).map(
                ([key, value]: [string, string]) => (
                  <div key={key} className="text-xs">
                    <span className="text-gray-500">{key}:</span>
                    <span className="text-gray-800 ml-1 font-medium">
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Reason */}
            <p className="text-gray-700 text-xs mb-3 leading-relaxed">
              {product.reason}
            </p>

            {/* Pros */}
            {product.pros.length > 0 && (
              <div className="mb-3">
                <p className="text-green-700 font-medium text-xs mb-1">
                  ✓ Ưu điểm:
                </p>
                <ul className="space-y-1">
                  {product.pros.map((pro: string, i: number) => (
                    <li key={i} className="text-gray-600 text-xs pl-4">
                      • {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {product.cons.length > 0 && (
              <div className="mb-3">
                <p className="text-orange-700 font-medium text-xs mb-1">
                  ⚠ Lưu ý:
                </p>
                <ul className="space-y-1">
                  {product.cons.map((con: string, i: number) => (
                    <li key={i} className="text-gray-600 text-xs pl-4">
                      • {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Value Score */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Đánh giá:</span>
                <div className="flex items-center">
                  {[...Array(10)].map((_, i: number) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        i < product.valueScore ? "bg-yellow-400" : "bg-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-semibold ml-1">
                    {product.valueScore}/10
                  </span>
                </div>
              </div>
              <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}

        {/* Advice */}
        {recommendations.advice && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-xs">
              💡 <span className="font-medium">Lời khuyên:</span>{" "}
              {recommendations.advice}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-5 right-5 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Trợ lý gợi ý sản phẩm</h3>
              <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user" ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {message.type === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-gray-700" />
                )}
              </div>
              <div
                className={`max-w-[75%] ${
                  message.type === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl p-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {typeof message.content === "string" ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    renderBotResponse(message.content)
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-gray-700" />
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <Loader2 size={20} className="animate-spin text-blue-600" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập yêu cầu của bạn..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
