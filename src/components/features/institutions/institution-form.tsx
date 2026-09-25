"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { fetcher } from "@/services/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PhoneInput } from "@/components/features/shared/phone-input";
import { AddressForm } from "@/components/features/shared/address-form";
import { ImageUpload } from "@/components/features/shared/image-upload";

const schema = z.object({
  name: z.string().min(1, "Institution name is required"),
  packageId: z.string().min(1, "Package selection is required"),
  establishedYear: z.coerce.number().optional(),
  hasResidentialSystem: z.boolean().default(false),
  logo: z.string().optional(),
  contactInfo: z.object({
    phone: z.string().min(1, "Contact phone is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
  }),
  address: z.object({
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default("Bangladesh"),
  }),
  currentCounts: z
    .object({
      students: z.coerce.number().optional().default(0),
      teachers: z.coerce.number().optional().default(0),
      employees: z.coerce.number().optional().default(0),
    })
    .optional(),
  adminName: z.string().min(1, "Admin Name is required"),
  adminEmail: z.string().email("Valid admin email is required"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function InstitutionForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetcher("/saas/packages"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      packageId: "",
      hasResidentialSystem: false,
      logo: "",
      contactInfo: { phone: "", email: "" },
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
      },
      currentCounts: { students: 0, teachers: 0, employees: 0 },
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const hasResidential = watch("hasResidentialSystem");
  const selectedPackage = watch("packageId");
  const phoneValue = watch("contactInfo.phone");
  const addressValue = watch("address");
  const logoValue = watch("logo");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload: any = { ...values };
      if (!payload.contactInfo?.email) {
        delete payload.contactInfo.email;
      }

      await fetcher("/saas/institutions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Institution created successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create institution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Institution Profile ─────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold border-b pb-2 text-foreground">
          Institution Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Institution Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Apex International"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="packageId">Subscription Package *</Label>
            <Select
              id="packageId"
              value={selectedPackage}
              onChange={(e) => setValue("packageId", e.target.value)}
              disabled={isLoadingPackages}
            >
              <option value="">Select a package tier</option>
              {packages?.map((pkg: any) => (
                <option key={pkg.id || pkg._id} value={pkg.id || pkg._id}>
                  {pkg.name} (${pkg.price}/{pkg.interval})
                </option>
              ))}
            </Select>
            {errors.packageId && (
              <p className="text-xs text-destructive">
                {errors.packageId.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info with PhoneInput */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Contact Phone *</Label>
            <PhoneInput
              value={phoneValue}
              onChange={(val) => setValue("contactInfo.phone", val)}
            />
            {errors.contactInfo?.phone && (
              <p className="text-xs text-destructive">
                {errors.contactInfo.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@institution.com"
              {...register("contactInfo.email")}
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-1.5">
          <Label>Institution Logo</Label>
          <ImageUpload
            value={logoValue}
            onChange={(val) => setValue("logo", val)}
            directory="institution-logos"
          />
        </div>

        {/* Address with AddressForm */}
        <div className="space-y-1.5 pt-2">
          <AddressForm
            value={addressValue}
            onChange={(val) => setValue("address", val)}
          />
          {errors.address?.addressLine1 && (
            <p className="text-xs text-destructive">
              {errors.address.addressLine1.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="establishedYear">Established Year</Label>
            <Input
              id="establishedYear"
              type="number"
              placeholder="e.g. 2010"
              {...register("establishedYear")}
            />
          </div>

          <div className="flex items-center space-x-3 pt-6">
            <Checkbox
              id="hasResidential"
              checked={hasResidential}
              onCheckedChange={(checked) =>
                setValue("hasResidentialSystem", checked)
              }
            />
            <Label
              htmlFor="hasResidential"
              className="text-sm font-medium cursor-pointer"
            >
              Has Residential / Branch System
            </Label>
          </div>
        </div>
      </div>

      {/* ── Initial Institution Admin ───────────────────── */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-base font-semibold text-foreground">
          Tenant Administrator Account
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          This account will be created as the initial primary administrator for this institution.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="adminName">Admin Full Name *</Label>
            <Input
              id="adminName"
              placeholder="John Doe"
              {...register("adminName")}
            />
            {errors.adminName && (
              <p className="text-xs text-destructive">
                {errors.adminName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adminEmail">Admin Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@institution.com"
              {...register("adminEmail")}
            />
            {errors.adminEmail && (
              <p className="text-xs text-destructive">
                {errors.adminEmail.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="adminPassword">Initial Password *</Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="At least 6 characters"
              {...register("adminPassword")}
            />
            {errors.adminPassword && (
              <p className="text-xs text-destructive">
                {errors.adminPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur-xs py-2">
        <Button
          type="submit"
          disabled={loading}
          className="gap-2 shadow-md min-w-[150px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Institution"
          )}
        </Button>
      </div>
    </form>
  );
}
