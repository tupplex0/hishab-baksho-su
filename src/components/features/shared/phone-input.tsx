"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { COUNTRY_CODES } from "@/constants/country-codes";

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const initialCode =
    COUNTRY_CODES.find((c) => value?.startsWith(c.code))?.code || "+880";
  const initialPhone = value ? value.replace(initialCode, "").trim() : "";

  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    if (phone) {
      onChange(`${code} ${phone}`);
    } else {
      onChange("");
    }
  }, [code, phone, onChange]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s-]/g, "");
    setPhone(val);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="w-[120px] shrink-0">
        <Select
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-10 text-xs font-medium"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.country})
            </option>
          ))}
        </Select>
      </div>
      <Input
        type="tel"
        placeholder="1700-000000"
        value={phone}
        onChange={handlePhoneChange}
        className="flex-1 h-10"
      />
    </div>
  );
}
