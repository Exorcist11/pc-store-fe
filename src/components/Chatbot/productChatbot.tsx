"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Search,
  TrendingUp,
  Tag,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { getGeminiRecommend } from "@/services/gemini";
import { useRouter } from "next/navigation";

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

interface MarketSuggestion {
  productName: string;
  brand: string;
  model: string;
  estimatedPrice: {
    min: number;
    max: number;
    currency: string;
  };
  specifications: Record<string, string>;
  reason: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  availableAt: string[];
  valueScore: number;
}

interface BotResponseData {
  success: boolean;
  data: {
    userQuery: string;
    analyzedFilter?: {
      productTypes: string[];
      categories: string[];
      brands: string[];
      keywords: string[];
    };
    totalProductsFound: number;
    source: string;
    recommendations: {
      summary: string;
      recommendations: ProductRecommendation[];
      advice: string;
    };
    marketSuggestions?: {
      message: string;
      marketSuggestions: MarketSuggestion[];
      buyingGuide: string;
      alternativeSearch: string;
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
  const router = useRouter();
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

  const formatPriceRange = (min: number, max: number, currency: string) => {
    const minFormatted = new Intl.NumberFormat("vi-VN").format(min);
    const maxFormatted = new Intl.NumberFormat("vi-VN").format(max);
    return `${minFormatted} - ${maxFormatted} ${currency}`;
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

    const res = await getGeminiRecommend({ query: inputValue });

    const botMessage: Message = {
      type: "bot",
      content: res,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const renderStoreProducts = (data: BotResponseData) => {
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
            <div className="flex items-center flex-col justify-between gap-3 pt-3 border-t">
              <div className="flex items-center gap-2 flex-col">
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
              <button
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium w-full"
                onClick={() => router.push(`/product/${product.productSlug}`)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}

        {/* Advice */}
        {recommendations?.advice && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-xs">
              💡 <span className="font-medium">Lời khuyên:</span>{" "}
              {recommendations?.advice}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderNoProductsFound = (data: BotResponseData) => {
    const { marketSuggestions, analyzedFilter, recommendations } = data.data;

    if (!marketSuggestions) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            Không tìm thấy sản phẩm phù hợp.
          </p>
          <p className="text-red-600 text-sm mt-2">
            Vui lòng thử lại với từ khóa khác.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Thông báo chính */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Search className="text-orange-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-2">
                Không tìm thấy trong cửa hàng
              </h3>
              <p className="text-gray-700 text-xs leading-relaxed mb-2">
                Hiện tại chúng tôi chưa có{" "}
                <span className="font-semibold text-orange-700">
                  "{data.data.userQuery}"
                </span>{" "}
                trong kho.
              </p>
              {analyzedFilter && analyzedFilter.keywords && (
                <div className="bg-white rounded-lg p-2 border border-orange-100">
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    🔍 Từ khóa liên quan:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analyzedFilter.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lời khuyên */}
        {recommendations?.advice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-base">💡</span>
              <p className="text-blue-800 text-xs leading-relaxed">
                {recommendations?.advice}
              </p>
            </div>
          </div>
        )}

        {/* Header sản phẩm thị trường */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} />
            <h3 className="font-bold text-sm">Gợi ý từ thị trường</h3>
          </div>
          <p className="text-purple-100 text-xs">{marketSuggestions.message}</p>
        </div>

        {/* Danh sách sản phẩm thị trường */}
        {marketSuggestions.marketSuggestions
          .slice(0, 3)
          .map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <ShoppingBag size={14} className="text-blue-600" />
                    <h4 className="font-bold text-gray-900 text-xs">
                      {product.productName}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
                <div className="flex items-center gap-0.5 bg-yellow-100 px-2 py-1 rounded">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        i < product.valueScore ? "bg-yellow-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-1">
                    {product.valueScore}/10
                  </span>
                </div>
              </div>

              {/* Giá */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-2 mb-2 border border-red-200">
                <p className="text-xs text-gray-600 mb-0.5">Giá tham khảo:</p>
                <p className="text-red-600 font-bold text-sm">
                  {formatPriceRange(
                    product.estimatedPrice.min,
                    product.estimatedPrice.max,
                    product.estimatedPrice.currency
                  )}
                </p>
              </div>

              {/* Thông số (chỉ hiển thị 4 spec quan trọng nhất) */}
              <div className="bg-gray-50 rounded-lg p-2 mb-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  ⚙️ Thông số:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(product.specifications)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-900 ml-1 font-medium text-xs">
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Ưu điểm (chỉ 2 điểm) */}
              <div className="bg-green-50 rounded-lg p-2 mb-2 border border-green-200">
                <p className="text-green-700 font-semibold text-xs mb-1">
                  ✓ Ưu điểm:
                </p>
                <ul className="space-y-0.5">
                  {product.pros.slice(0, 2).map((pro, i) => (
                    <li key={i} className="text-gray-700 text-xs">
                      • {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nơi mua */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex flex-wrap gap-1">
                  {product.availableAt.slice(0, 2).map((store, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded"
                    >
                      {store}
                    </span>
                  ))}
                </div>
                {/* <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1">
                  Xem
                  <ExternalLink size={10} />
                </button> */}
              </div>
            </div>
          ))}

        {/* Hướng dẫn mua hàng */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="bg-indigo-100 p-1.5 rounded">
              <Tag className="text-indigo-600" size={16} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-indigo-900 text-xs mb-1">
                📚 Hướng dẫn mua
              </h4>
              <p className="text-gray-700 text-xs leading-relaxed mb-2">
                {marketSuggestions.buyingGuide}
              </p>
              <div className="bg-white rounded p-2 border border-indigo-100">
                <p className="text-xs text-gray-600 mb-1">
                  🔎 Từ khóa thay thế:
                </p>
                <p className="text-indigo-700 text-xs font-medium">
                  {marketSuggestions.alternativeSearch}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBotResponse = (data: BotResponseData) => {
    if (!data.success) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">
            Đã xảy ra lỗi khi xử lý yêu cầu.
          </p>
          <p className="text-red-600 text-sm mt-2">Vui lòng thử lại sau.</p>
        </div>
      );
    }

    // Case 1: Có sản phẩm trong cửa hàng
    if (
      data.data.totalProductsFound > 0 &&
      data.data.recommendations.recommendations.length > 0
    ) {
      return renderStoreProducts(data);
    }

    // Case 2: Không có sản phẩm trong cửa hàng, hiển thị gợi ý từ thị trường
    return renderNoProductsFound(data);
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
        className={`fixed bottom-5 right-5 w-[500px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${
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
