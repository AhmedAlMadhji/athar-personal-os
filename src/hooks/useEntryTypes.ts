"use client";

import { useCallback, useEffect, useState } from "react";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { getCustomEntryTypes } from "@/lib/entryTypesService";
import { CORE_ENTRY_TYPES } from "@/types/entry";
import type { CustomEntryType } from "@/types/customEntryType";

export function useEntryTypes() {
  const [customTypes, setCustomTypes] = useState<CustomEntryType[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const types = await getCustomEntryTypes();
    setCustomTypes(types);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  return {
    ready,
    coreTypes: CORE_ENTRY_TYPES,
    customTypes,
    allTypeIds: [...CORE_ENTRY_TYPES, ...customTypes.map((t) => t.id)],
    reload: load,
  };
}
