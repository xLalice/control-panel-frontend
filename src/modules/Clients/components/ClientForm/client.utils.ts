export const cleanFormData = <T extends Record<string, any>>(data: T): T => {
  const cleaned = { ...data };

  Object.keys(cleaned).forEach((key) => {
    if (
      typeof (cleaned as Record<string, any>)[key] === "string" &&
      (cleaned as Record<string, any>)[key]?.trim() === ""
    ) {
      (cleaned as Record<string, any>)[key] = null;
    }
  });

  return cleaned;
};

export const copyAddressFields = (
  source: Record<string, any>,
  sourcePrefix: string,
  targetPrefix: string
): Record<string, any> => {
  const addressFields = ["Street", "City", "Region", "PostalCode", "Country"];
  const updates: Record<string, any> = {};

  addressFields.forEach((field) => {
    const sourceKey = `${sourcePrefix}Address${field}`;
    const targetKey = `${targetPrefix}Address${field}`;
    updates[targetKey] = source[sourceKey];
  });

  return updates;
};
