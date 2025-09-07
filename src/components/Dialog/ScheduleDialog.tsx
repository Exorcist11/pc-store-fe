import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import useLoadingStore from "@/hooks/useLoading";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { dialogTitle } from "@/utils/dialogTitle";
import { ACTION, PAGE } from "@/constants/action";
import { Skeleton } from "../ui/skeleton";
import { errorFunc } from "@/lib/errorFunc";
import { InputWithLabel } from "../CustomInput/InputWithLable";
import ReactSelect, { OptionsSelect } from "../CustomSelect/ReactSelect";
import { Switch } from "../ui/switch";
import {
  addNewRoute,
  deleteRoute,
  getRouteById,
  updateRoute,
} from "@/services/route";
import { scheduleSchema } from "@/lib/schema";
import {
  addNewSchedule,
  getScheduleById,
  updateSchedule,
} from "@/services/schedule";

interface IScheduleProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  setType: (type: string) => void;
  id: string;
  reload?: (pageIndex: number) => Promise<void>;
  CAR_OPTION: OptionsSelect[];
  ROUTE_OPTION: OptionsSelect[];
}

export default function ScheduleDialog(props: IScheduleProps) {
  const { open, setOpen, type, id, reload, setType, CAR_OPTION, ROUTE_OPTION } =
    props;
  const { loading, startLoading, stopLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      car: "",
      departureTime: "",
      destinationTime: "",
      price: 0,
      route: "",
      isActive: true,
    },
  });

  const onDelete = async () => {
    try {
      startLoading();
      if (type === ACTION.DELETE) {
        await deleteRoute(id);
      }
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
      reload && reload(1);
      setOpen(false);
    }
  };

  const getScheduleDetail = async () => {
    startLoading();
    try {
      const response = await getScheduleById(id);
      const defaultFormValue = {
        route: response.route,
        car: response.car,
        departureTime: response.departureTime,
        price: response.price,
        isActive: response.isActive,
      };
      form.reset(defaultFormValue);
    } catch (error) {
      console.error("Error from get detail schedule: ", error);
    } finally {
      stopLoading();
    }
  };

  const onSubmit = async (data: z.infer<typeof scheduleSchema>) => {
    try {
      startLoading();
      if (type === ACTION.ADD) {
        await addNewSchedule(data);
      }
      if (type === ACTION.EDIT) {
        await updateSchedule(data, id);
      }
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
      reload && reload(1);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (type !== ACTION.ADD) {
      getScheduleDetail();
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen && setOpen(!open)}>
      <DialogContent className="sm:max-w-[700px]">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>{dialogTitle(type, PAGE.SCHEDULE)}</DialogTitle>
          </DialogHeader>
          {type === ACTION.DELETE ? (
            <>
              <h3>
                Bạn có xác nhận xóa người dùng trên. Dữ liệu xóa không thể khôi
                phục!
              </h3>

              <DialogFooter className="w-full flex flex-row sm:justify-between">
                <div className="flex gap-2 items-center justify-end w-full">
                  <Button
                    type="reset"
                    variant={"outline"}
                    disabled={loading}
                    onClick={() => setOpen(false)}
                  >
                    Hủy bỏ
                  </Button>

                  <Button
                    type="button"
                    variant={"destructive"}
                    disabled={loading}
                    onClick={onDelete}
                  >
                    Xác nhận
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <>
              {loading && type !== ACTION.ADD ? (
                <div className="flex flex-col gap-5 py-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit, errorFunc)}
                  className="flex flex-col gap-5 py-4 w-full"
                >
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <ReactSelect
                            options={ROUTE_OPTION}
                            value={ROUTE_OPTION.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption?.value);
                            }}
                            label="Chọn tuyến đường"
                            isRequired
                            placeholder="Chọn tuyến đường"
                            disabled={type === ACTION.VIEW}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="car"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <ReactSelect
                            value={CAR_OPTION.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption?.value);
                            }}
                            options={CAR_OPTION}
                            label="Chọn xe"
                            isRequired
                            placeholder="Chọn xe"
                            disabled={type === ACTION.VIEW}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-5 w-full justify-between">
                    <FormField
                      control={form.control}
                      name="departureTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              placeholder="Giờ khởi hành"
                              title="Giờ khởi hành"
                              type="text"
                              disable={type === ACTION.VIEW}
                              isRequired
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <InputWithLabel
                              {...field}
                              placeholder="Giờ cập bến"
                              title="Giờ cập bến"
                              type="text"
                              disable={type === ACTION.VIEW}
                              isRequired
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            {...field}
                            placeholder="Giá vé"
                            title="Giá vé"
                            type="number"
                            disable={type === ACTION.VIEW}
                            isRequired
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : "";
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="w-full flex-col flex">
                        <FormLabel className="font-bold">Trạng thái</FormLabel>
                        <Switch
                          disabled={type === ACTION.VIEW}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="w-full flex flex-row sm:justify-between">
                    <div className="flex gap-2 items-center justify-end w-full">
                      <Button
                        type="reset"
                        variant={"outline"}
                        disabled={loading}
                        onClick={() => setOpen(false)}
                      >
                        Hủy bỏ
                      </Button>
                      {type === ACTION.VIEW && (
                        <Button
                          type="button"
                          disabled={loading}
                          onClick={() => setType(ACTION.EDIT)}
                        >
                          Chỉnh sửa
                        </Button>
                      )}

                      {type !== ACTION.VIEW && (
                        <Button type="submit" disabled={loading}>
                          {loading ? "Loading..." : "Lưu"}
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </form>
              )}
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
