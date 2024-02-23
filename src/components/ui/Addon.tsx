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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientCategory, Sizes } from "@prisma/client";

export default function Addon({
  ingredientName,
  itemSize,
  ingredientPrice,
  ingredientId,
  ingredientCategory,
  itemId,
  selectedAddons,
  handleAddAddon,
  handleRemoveAddon,
  handleUpdateAddon,
  showCountSelection,
  maxAddonCount,
}: {
  ingredientName: string;
  itemSize: { size: Sizes; price: number };
  ingredientPrice: number;
  ingredientId: number;
  ingredientCategory: IngredientCategory;
  itemId: number;
  selectedAddons: AddonType[];
  handleAddAddon: (value: AddonType) => void;
  handleRemoveAddon: (value: AddonType["addonName"]) => void;
  handleUpdateAddon: (value: AddonType) => void;
  showCountSelection: boolean;
  maxAddonCount: number;
}) {
  const existingAddon: AddonType | undefined = selectedAddons.find((addon) => {
    if (addon.addonName === ingredientName) return addon;
  });

  const [enabled, setEnabled] = useState<CheckedState>(
    selectedAddons.length > 0 && existingAddon ? true : false
  );
  const [count, setCount] = useState(
    selectedAddons.length > 0 && existingAddon ? existingAddon.addonCount : 1
  );
  const [dropdownOptions, setDropdownOptions] = useState(
    Array.from({ length: maxAddonCount }, (_, i) => i + 1)
  );

  const handleCheckedChange = (e: CheckedState) => {
    setEnabled(e);
    if (e === true) {
      const price =
        itemSize.size === "l" ? ingredientPrice * 2 : ingredientPrice;
      handleAddAddon({
        addonId: itemId,
        ingredientId: ingredientId,
        addonName: ingredientName,
        addonPrice: price,
        addonCount: count,
        addonCategory: ingredientCategory,
      });
      setDropdownOptions(
        [
          ...Array(
            maxAddonCount -
              selectedAddons.reduce(
                (total, addon) => total + addon.addonCount,
                0
              )
          ),
        ].map((_, i) => i + 1)
      );
    } else {
      setCount(1);
      handleRemoveAddon(ingredientName);
    }
  };

  const handleCountChange = (newCount: number) => {
    const price =
      itemSize && itemSize.size === "l" ? ingredientPrice * 2 : ingredientPrice;
    setCount(newCount);
    handleUpdateAddon({
      addonId: itemId,
      ingredientId: ingredientId,
      addonName: ingredientName,
      addonPrice: price,
      addonCount: newCount,
      addonCategory: ingredientCategory,
    });
  };

  useEffect(() => {
    const totalAddons = selectedAddons.reduce(
      (total, addon) =>
        total + (addon.addonName === ingredientName ? 0 : addon.addonCount),
      0
    );
    if (totalAddons < maxAddonCount) {
      setDropdownOptions(
        [...Array(maxAddonCount - totalAddons)].map((_, i) => i + 1)
      );
    } else {
      setDropdownOptions([count]);
    }
  }, [selectedAddons, count, ingredientName]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <Checkbox
          id={ingredientName}
          onCheckedChange={handleCheckedChange}
          checked={enabled}
          disabled={
            selectedAddons.reduce(
              (total, addon) => total + addon.addonCount,
              0
            ) >= maxAddonCount && enabled !== true
          }
        />
        <Label htmlFor={ingredientName}>
          {ingredientName} +
          {itemSize && itemSize.size === "l"
            ? ((ingredientPrice * 2) / 100).toFixed(2)
            : (ingredientPrice / 100).toFixed(2)}
          €{" "}
        </Label>
      </div>

      {enabled === true && showCountSelection && (
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
