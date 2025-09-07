"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Bus, Calendar, Map, Ticket, Trash, X } from "lucide-react";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITripDetail } from "@/interface/trip.interface";
import { getTripDetail } from "@/services/trips";
import { Skeleton } from "../ui/skeleton";
import {
  calculateArrivalTime,
  formatMinutesToHourMinute,
} from "@/utils/formatTime";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { format } from "date-fns";

// Zod schema
const seatSchema = z.object({
  selectedSeats: z.array(z.string()).min(1, "Bạn phải chọn ít nhất 1 ghế."),
});

type SeatFormData = z.infer<typeof seatSchema>;

interface IDialog {
  open: string;
  setOpen: (open: string) => void;
}

export default function SelectSeatDialog({ open, setOpen }: IDialog) {
  const [ticketDetail, setTicketDetail] = React.useState<ITripDetail>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SeatFormData>({
    resolver: zodResolver(seatSchema),
    defaultValues: {
      selectedSeats: [],
    },
  });

  const selectedSeats = watch("selectedSeats");

  const handleSeatToggle = (seatCode: string) => {
    const current = [...selectedSeats];
    if (current.includes(seatCode)) {
      setValue(
        "selectedSeats",
        current.filter((seat) => seat !== seatCode)
      );
    } else {
      setValue("selectedSeats", [...current, seatCode]);
    }
  };

  const isSelected = (seatCode: string) => selectedSeats.includes(seatCode);
  const isBooked = (seatCode: string) => {
    // Check both local booked seats and API booked seats
    const apiBookedSeats =
      ticketDetail?.seats
        ?.filter((seat) => seat.isBooked)
        .map((seat) => seat.id) || [];
    return bookedSeats.includes(seatCode) || apiBookedSeats.includes(seatCode);
  };

  // Parse seat layout (e.g., "3x2" means 3 seats per row, 2 floors)
  const parseSeatLayout = () => {
    if (!ticketDetail?.seatLayout) return { seatsPerRow: 3, floors: 2 };

    const [seatsPerRow, floors] = ticketDetail.seatLayout
      .split("x")
      .map(Number);
    return { seatsPerRow: seatsPerRow || 3, floors: floors || 2 };
  };

  // Group seats by floor based on seat ID pattern
  const groupSeatsByFloor = () => {
    if (!ticketDetail?.seats) return [];

    const { floors } = parseSeatLayout();
    const seats = ticketDetail.seats;

    // Group seats by their letter prefix (A, B, C, etc.)
    const seatGroups: { [key: string]: any[] } = {};
    seats.forEach((seat) => {
      const letter = seat.id.charAt(0);
      if (!seatGroups[letter]) {
        seatGroups[letter] = [];
      }
      seatGroups[letter].push(seat);
    });

    // Sort seats within each group by number
    Object.keys(seatGroups).forEach((letter) => {
      seatGroups[letter].sort((a, b) => {
        const numA = parseInt(a.id.slice(1));
        const numB = parseInt(b.id.slice(1));
        return numA - numB;
      });
    });

    // Get available columns (A, B, C) and sort them
    const columns = Object.keys(seatGroups).sort();

    // Create floor layout - distribute seats evenly across floors
    const floorLayouts = [];
    for (let floor = 0; floor < floors; floor++) {
      const floorColumns: { [key: string]: any[] } = {};

      columns.forEach((letter) => {
        const columnSeats = seatGroups[letter];
        const seatsPerFloor = Math.ceil(columnSeats.length / floors);
        const startIdx = floor * seatsPerFloor;
        const endIdx = Math.min(startIdx + seatsPerFloor, columnSeats.length);

        floorColumns[letter] = columnSeats.slice(startIdx, endIdx);
      });

      floorLayouts.push({
        floor: floor + 1,
        columns: floorColumns,
        columnOrder: columns,
      });
    }

    return floorLayouts;
  };

  // Render seats in columns (A, B, C) for each floor
  const renderSeatsByColumns = (floorData: any) => {
    const maxRows = Math.max(
      ...floorData.columnOrder.map(
        (col: string) => floorData.columns[col].length
      )
    );

    const rows = [];
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
      const rowSeats = floorData.columnOrder
        .map((col: string) => floorData.columns[col][rowIdx] || null)
        .filter(Boolean);

      if (rowSeats.length > 0) {
        rows.push(rowSeats);
      }
    }
    return rows;
  };

  const onSubmit = async (data: SeatFormData) => {
    try {
      // Simulate booking API call
      console.log("Booking seats:", data.selectedSeats);

      // Add selected seats to booked seats
      setBookedSeats((prev) => [...prev, ...data.selectedSeats]);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      reset();
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const handleDeleteBookedSeat = (seatCode: string) => {
    setBookedSeats((prev) => prev.filter((seat) => seat !== seatCode));
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setOpen("");
  };

  const fetchTripDetail = async () => {
    if (!open) return;

    setLoading(true);
    try {
      const response = await getTripDetail(open);
      setTicketDetail(response);
    } catch (error) {
      console.error("Error fetching trip detail: ", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchTripDetail();
    }
  }, [open]);

  const { floors } = parseSeatLayout();
  const floorLayouts = groupSeatsByFloor();

  return (
    <>
      <Dialog
        open={!!open && !showSuccessDialog}
        onOpenChange={() => setOpen && setOpen("")}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="max-w-[900px] rounded-lg overflow-y-auto max-h-[600px] laptop:max-h-[700px] grid grid-cols-3 bg-white">
            <DialogHeader className="col-span-3 text-darkBurgundy uppercase">
              <DialogTitle className="text-2xl">Chọn ghế của bạn</DialogTitle>
            </DialogHeader>

            {loading ? (
              <Skeleton className="h-[125px] w-full col-span-3 rounded-xl" />
            ) : (
              <div className="border rounded-lg flex flex-col gap-3 col-span-3 py-4 laptop:col-span-2">
                <h3 className="text-center text-xl font-bold text-darkBurgundy">
                  Vận Tải Đông Lý
                </h3>

                <div className="grid grid-cols-1 gap-5 px-4 tablet:grid-cols-2">
                  {floorLayouts.map((floorData, floorIdx) => (
                    <div
                      key={`floor-${floorData.floor}`}
                      className="col-span-1 bg-[#f4f4f4] rounded-md py-4"
                    >
                      <p className="text-center text-blue-600 text-sm font-bold mb-4">
                        Tầng {floorData.floor}
                      </p>

                      {/* Header với tên cột A, B, C */}
                      <div className="flex justify-center gap-8 mb-2 px-2">
                        {floorData.columnOrder.map((col: string) => (
                          <div key={col} className="w-10 text-center">
                            <span className="text-xs font-bold text-gray-600">
                              {col}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Seats arranged by columns */}
                      <div className="px-2">
                        {renderSeatsByColumns(floorData).map((row, rowIdx) => (
                          <div
                            key={`row-${rowIdx}`}
                            className="flex justify-center gap-8 mb-2"
                          >
                            {row.map((seat: any, colIdx: number) => {
                              const seatIsBooked = isBooked(seat.id);
                              const seatIsSelected = isSelected(seat.id);

                              return (
                                <div
                                  key={seat.id}
                                  className="flex justify-center"
                                  onClick={() =>
                                    !seatIsBooked && handleSeatToggle(seat.id)
                                  }
                                >
                                  <div
                                    className={`flex justify-center items-center text-xs w-10 h-10 font-bold rounded-md border 
                                    ${
                                      seatIsBooked
                                        ? "bg-red-500 text-white cursor-not-allowed"
                                        : seatIsSelected
                                        ? "bg-green-500 text-white cursor-pointer"
                                        : "bg-slate-300 cursor-pointer hover:bg-slate-400"
                                    }`}
                                  >
                                    {seat.id}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chú thích ghế */}
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-300 rounded"></div>
                    <span>Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Đã đặt</span>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <Skeleton className="h-[125px] col-span-3 rounded-xl" />
            ) : (
              <div className="flex flex-col gap-3 col-span-3 laptop:col-span-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-mediumGray">
                    <Map size={18} color="#C00023" />{" "}
                    {ticketDetail?.startLocation} → {ticketDetail?.endLocation}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-mediumGray">
                    <Calendar size={18} color="#C00023" />
                    {ticketDetail?.date
                      ? format(new Date(ticketDetail.date), "dd/MM/yyyy")
                      : "N/A"}{" "}
                    {""}| {ticketDetail?.departureTime} - {""}
                    {calculateArrivalTime(
                      ticketDetail?.departureTime,
                      Number(ticketDetail?.duration)
                    )}{" "}
                    ({formatMinutesToHourMinute(Number(ticketDetail?.duration))}
                    )
                  </div>
                  <div className="flex items-center gap-2 text-sm text-mediumGray">
                    <Bus size={18} color="#C00023" />
                    {formatPhoneNumber(ticketDetail?.carInfo.phoneNumber)} -
                    Biển số: {ticketDetail?.carInfo.licensePlate}
                  </div>
                </div>

                <div className="border border-green-600 rounded-lg p-3 flex flex-col gap-3 text-sm flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-green-600">
                      Thông tin đặt vé:
                    </h3>
                    {selectedSeats.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setValue("selectedSeats", [])}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>

                  <div className="min-h-[250px] max-h-[250px] overflow-y-auto hide-scrollbar flex flex-col gap-2">
                    {selectedSeats.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Ticket className="mx-auto mb-2 h-8 w-8" />
                          <p>Chưa chọn ghế nào</p>
                        </div>
                      </div>
                    ) : (
                      selectedSeats.map((seat) => (
                        <div
                          key={seat}
                          className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md group hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 text-white rounded text-xs flex items-center justify-center font-bold">
                              {seat}
                            </div>
                            <span className="font-semibold text-green-700">
                              Ghế {seat}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">
                              {ticketDetail?.price.toLocaleString()} VND
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSeatToggle(seat)}
                              className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                              title="Xóa ghế này"
                            >
                              <Trash size={18} color="#C00023" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator className="border-t border-dashed w-full h-0 border-green-500" />
                  <div className="flex justify-between font-bold">
                    <h3 className="text-green-600">Tổng tiền:</h3>
                    <p className="text-lg text-green-700">
                      {(
                        selectedSeats.length * (ticketDetail?.price || 0)
                      ).toLocaleString()}{" "}
                      VND
                    </p>
                  </div>
                </div>

                {/* Hiển thị lỗi validation */}
                {errors.selectedSeats && (
                  <div className="col-span-1 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm font-medium">
                      {errors.selectedSeats.message}
                    </p>
                  </div>
                )}

                {/* Hiển thị ghế đã đặt nếu có */}
                {bookedSeats.length > 0 && (
                  <div className="border border-blue-600 rounded-lg p-3 flex flex-col gap-3 text-sm">
                    <h3 className="font-bold text-blue-600">
                      Ghế đã đặt ({bookedSeats.length}):
                    </h3>
                    <div className="max-h-[100px] overflow-y-auto flex flex-wrap gap-1">
                      {bookedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="col-span-3 flex justify-between items-center">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="px-5 py-3 rounded-3xl"
                  onClick={() => setOpen("")}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  disabled={selectedSeats.length === 0}
                  className="px-5 py-3 rounded-3xl bg-darkBurgundy hover:bg-darkBurgundyHover text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Đặt vé{" "}
                  {selectedSeats.length > 0 && `(${selectedSeats.length} ghế)`}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
