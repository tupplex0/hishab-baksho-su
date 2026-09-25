"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface AddressFormProps {
  value?: Address;
  onChange: (value: Address) => void;
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  const address = value || {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
  };

  const handleChange = (field: keyof Address, val: string) => {
    onChange({ ...address, [field]: val });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>
          Address Line 1 <span className="text-destructive">*</span>
        </Label>
        <Input
          value={address.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          placeholder="e.g. 12/A Motijheel C/A"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>Address Line 2</Label>
        <Input
          value={address.addressLine2 || ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          placeholder="Floor 4, Suite 402"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>City / District</Label>
          <Input
            value={address.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Dhaka"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Division / State</Label>
          <Input
            value={address.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Dhaka"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Postal / Zip Code</Label>
          <Input
            value={address.zipCode || ""}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            placeholder="1000"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Input
            value={address.country || "Bangladesh"}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="Bangladesh"
          />
        </div>
      </div>
    </div>
  );
}
