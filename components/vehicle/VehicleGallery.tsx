"use client";

import Image from "next/image";
import { useState } from "react";

export function VehicleGallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const list = fotos.length ? fotos : ["/placeholder-car.svg"];
  const [idx, setIdx] = useState(0);
  const current = list[idx] || "/placeholder-car.svg";

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 720px"
          priority
          unoptimized
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border ${
                i === idx ? "border-brand ring-2 ring-brand/30" : "border-slate-200"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="96px" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
