"use client";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "../ui/command";
import { Icons } from "../icons";
type Props = {
  items: Record<string, string>[];
};

function CommandBar({ items }: Props) {
  const [values, setValues] = useState<Set<string>>(new Set());

  const onSelect = useCallback(
    (vl: string) => {
      const isExisted = values.has(vl);

      setValues((old) => {
        const newSet = new Set(old);
        if (isExisted) {
          newSet.delete(vl);
        } else {
          newSet.add(vl);
        }
        return newSet;
      });
      return;
    },
    [values],
  );

  useEffect(() => console.log(values), [values]);

  const renderItems = useMemo(
    () =>
      items.map(({ label, value }) => {
        const isSelected = values.has(value);
        return (
          <CommandItem key={label} value={value} onSelect={onSelect}>
            {label}
            {isSelected && <Icons.Check className="w-4 h-4 text-green-500" />}
          </CommandItem>
        );
      }),
    [items, values],
  );

  return (
    <>
      {values}
      <Command>
        <CommandInput
          placeholder="Filter label..."
          autoFocus={true}
          className="h-9"
        />
        <CommandList>
          <CommandEmpty>No label found.</CommandEmpty>
          <CommandGroup>{renderItems}</CommandGroup>
        </CommandList>
      </Command>
    </>
  );
}

export default CommandBar;
