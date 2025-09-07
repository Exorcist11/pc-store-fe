import { parse, addMinutes, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function formatTime(dateString: any) {
  const date = new Date(dateString);

  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return ` ${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
}

export const parseISODate = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    // Decode URL-encoded date string
    const decodedDate = decodeURIComponent(dateString);

    // Parse ISO date string
    const date = new Date(decodedDate);

    // Validate date
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatDurationWithDateFns = (
  minutes: number,
  pattern = "H'h' mm'm'"
) => {
  const base = new Date(Date.UTC(1970, 0, 1, 0, 0)); // Ép base là 00:00 UTC
  const date = addMinutes(base, minutes);
  return formatInTimeZone(date, "UTC", pattern);
};

export const calculateArrivalTime = (
  departureTime?: string, // "05:00"
  durationMinutes?: number // 240
): string => {
  if (!departureTime || typeof durationMinutes !== "number") return "N/A";

  const baseDate = new Date(); // Dùng ngày hôm nay
  const departureDate = parse(departureTime, "HH:mm", baseDate);

  const arrivalDate = addMinutes(departureDate, durationMinutes);

  return format(arrivalDate, "HH:mm"); // hoặc "hh:mm a" nếu bạn muốn AM/PM
};

export const formatDurationReadable = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourText = hours > 0 ? `${hours} giờ` : "";
  const minuteText = mins > 0 ? `${mins} phút` : "";

  return [hourText, minuteText].filter(Boolean).join(" ");
};

export function formatMinutesToHourMinute(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins.toString().padStart(2, "0")}'`;
}

