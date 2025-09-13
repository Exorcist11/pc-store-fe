"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FormDebugPanelProps {
  form: any; // nếu muốn chặt hơn có thể type theo UseFormReturn<T>
}

export default function FormDebugPanel({ form }: FormDebugPanelProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>🔧 Debug Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="form-data">
            <AccordionTrigger>Form Data</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(form.watch(), null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="form-errors">
            <AccordionTrigger>Form Errors</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs bg-red-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
