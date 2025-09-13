"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";

interface FormStatusCardProps {
  form: UseFormReturn<any>;
}

const FormStatusCard: React.FC<FormStatusCardProps> = ({ form }) => {
  const errors = form.formState.errors;
  const errorCount = Object.keys(errors).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex items-center justify-between">
            <span>Form hợp lệ:</span>
            <Badge variant={form.formState.isValid ? "default" : "destructive"}>
              {form.formState.isValid ? "Hợp lệ" : "Chưa hợp lệ"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Số lỗi:</span>
            <Badge variant={errorCount === 0 ? "default" : "destructive"}>
              {errorCount}
            </Badge>
          </div>
          {errorCount > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Các lỗi:</p>
              <ul className="text-xs text-red-600 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    • {field}: {String(error?.message) || "Lỗi không xác định"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormStatusCard;
