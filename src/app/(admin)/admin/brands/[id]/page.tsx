"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IBrand } from "@/interface/brands.interface";

export default function BrandPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [initialData, setInitialData] = useState<IBrand | undefined>(undefined);

  const isCreate = params?.id === "new";

  useEffect(() => {
    // if (!isCreate) {
    //   // fetch brand theo id
    //   fetch(`/api/brands/${id}`)
    //     .then((res) => res.json())
    //     .then((data) => setInitialData(data))
    //     .finally(() => setLoading(false));
    // } else {
    //   setLoading(false);
    // }
  }, [params?.id, isCreate]);

  const handleSubmit = async (data: IBrand) => {
    if (isCreate) {
      await fetch("/api/brands", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`/api/brands/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
    router.push("/admin/brands");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {isCreate ? "Tạo Brand mới" : "Chỉnh sửa Brand"}
      </h1>
    </div>
  );
}
