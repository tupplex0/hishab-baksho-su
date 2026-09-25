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
import { useState } from "react";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  pricePerUser: z.coerce.number().min(0).optional().default(0),
  interval: z.enum(["monthly", "yearly", "lifetime"]).default("monthly"),
  maxUsers: z.coerce.number().min(1, "At least 1 user required"),
  maxLocations: z.coerce.number().min(1, "At least 1 location required"),
  isPopular: z.boolean().default(false),
  features: z.string().optional(), // Comma-separated or newline-separated
});

type FormValues = z.infer<typeof schema>;

export function PackageForm({
  packageData,
  onSuccess,
}: {
  packageData?: any;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: packageData?.name || "",
      description: packageData?.description || "",
      price: packageData?.price ?? 49,
      pricePerUser: packageData?.pricePerUser ?? 5,
      interval: packageData?.interval || "monthly",
      maxUsers: packageData?.maxUsers ?? 10,
      maxLocations: packageData?.maxLocations ?? 1,
      isPopular: packageData?.isPopular ?? false,
      features: Array.isArray(packageData?.features)
        ? packageData.features.join(", ")
        : "",
    },
  });

  const isPopular = watch("isPopular");
  const selectedInterval = watch("interval");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const featureList = values.features
        ? values.features
            .split(/,|\n/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        pricePerUser: values.pricePerUser,
        interval: values.interval,
        maxUsers: values.maxUsers,
        maxLocations: values.maxLocations,
        isPopular: values.isPopular,
        features: featureList,
      };

      if (packageData?._id || packageData?.id) {
        await fetcher(`/saas/packages/${packageData._id || packageData.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Package updated successfully");
      } else {
        await fetcher("/saas/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Package created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Package Name *</Label>
        <Input
          id="name"
          placeholder="e.g. Starter, Growth, Enterprise"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Short Description</Label>
        <Input
          id="description"
          placeholder="Ideal for multi-branch retail operations"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Base Price ($) *</Label>
          <Input id="price" type="number" {...register("price")} />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="interval">Billing Interval</Label>
          <Select
            id="interval"
            value={selectedInterval}
            onChange={(e) =>
              setValue("interval", e.target.value as "monthly" | "yearly" | "lifetime")
            }
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="lifetime">Lifetime</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="maxUsers">Max Users / Staff</Label>
          <Input id="maxUsers" type="number" {...register("maxUsers")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="maxLocations">Max Locations / Stores</Label>
          <Input id="maxLocations" type="number" {...register("maxLocations")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="features">Features (comma or line-separated)</Label>
        <Input
          id="features"
          placeholder="POS, Inventory, Supplier Wallets, Daily Close"
          {...register("features")}
        />
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Checkbox
          id="isPopular"
          checked={isPopular}
          onCheckedChange={(checked) => setValue("isPopular", checked)}
        />
        <Label htmlFor="isPopular" className="text-sm font-medium cursor-pointer">
          Highlight as &quot;Popular&quot; tier
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Package"
          )}
        </Button>
      </div>
    </form>
  );
}
