"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const router = useRouter();

  return (
    <div className=" overflow-scroll hide-scrollbar">
      <div className="relative ">
        <div className="relative w-full h-[700px] laptop:h-[800px]  ">
          <Image
            src="https://res.cloudinary.com/deyszirfc/image/upload/v1753519381/bg-web_qxaf35.avif"
            alt="Sample Image"
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.4)] via-[rgba(192,0,35,0.8)] to-[rgba(0,0,0,0.7)]" />
        </div>
      </div>
    </div>
  );
}
