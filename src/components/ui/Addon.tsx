"use client";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { Label } from "./label";
import { CheckedState } from "@radix-ui/react-checkbox";
import { AddonType } from "@/lib/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Addon({
  incredientName,
  incredientPrice,
  itemId,
  selectedAddons,
  handleAddAddon,
  handleRemoveAddon,
  handleUpdateAddon,
}: {
  incredientName: string;
  incredientPrice: number;
  itemId: number;
  selectedAddons: AddonType[];
  handleAddAddon: (value: AddonType) => void;
  handleRemoveAddon: (value: AddonType["addonName"]) => void;
  handleUpdateAddon: (value: AddonType) => void;
}) {
  const existingAddon: AddonType | undefined = selectedAddons.find((addon) => {
    if (addon.addonName === incredientName) return addon;
  });

  const [enabled, setEnabled] = useState<CheckedState>(
    selectedAddons.length > 0 && existingAddon ? true : false
  );
  const [count, setCount] = useState(
    selectedAddons.length > 0 && existingAddon ? existingAddon.addonCount : 1
  );
  const [dropdownOptions, setDropdownOptions] = useState([1, 2, 3, 4, 5]);

  const handleCheckedChange = (e: CheckedState) => {
    setEnabled(e);
    if (e === true) {
      handleAddAddon({
        addonId: itemId,
        addonName: incredientName,
        addonPrice: incredientPrice,
        addonCount: count,
      });
      setDropdownOptions(
        [
          ...Array(
            5 -
              selectedAddons.reduce(
                (total, addon) => total + addon.addonCount,
                0
              )
          ),
        ].map((_, i) => i + 1)
      );
    } else {
      setCount(1);
      handleRemoveAddon(incredientName);
    }
  };

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
    handleUpdateAddon({
      addonId: itemId,
      addonName: incredientName,
      addonPrice: incredientPrice,
      addonCount: newCount,
    });
  };

  useEffect(() => {
    const totalAddons = selectedAddons.reduce(
      (total, addon) =>
        total + (addon.addonName === incredientName ? 0 : addon.addonCount),
      0
    );
    if (totalAddons < 5) {
      setDropdownOptions([...Array(5 - totalAddons)].map((_, i) => i + 1));
    } else {
      setDropdownOptions([count]);
    }
  }, [selectedAddons, count, incredientName]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <Checkbox
          id={incredientName}
          onCheckedChange={handleCheckedChange}
          checked={enabled}
          disabled={
            selectedAddons.reduce(
              (total, addon) => total + addon.addonCount,
              0
            ) >= 5 && enabled !== true
          }
        />
        <Label htmlFor={incredientName}>
          {incredientName} +{(incredientPrice / 100).toFixed(2)}€{" "}
        </Label>
      </div>

      {enabled === true && (
        <Select
          value={count.toString()}
          onValueChange={(e) => handleCountChange(Number(e))}
        >
          <SelectTrigger className="w-3/12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dropdownOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
