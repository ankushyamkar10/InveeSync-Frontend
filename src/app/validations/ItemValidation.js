'use client'
export const ITEM_TYPES = {
  SELL: "sell",
  PURCHASE: "purchase",
  COMPONENT: "component",
};

export const UOM_TYPES = {
  KGS: "kgs",
  NOS: "nos",
};

// Mock tenant_id validation

// Track existing items to check for uniqueness using a Set

// Helper function to generate unique key for an item based on internal_item_name + tenant_id
const generateItemKey = (internal_item_name, tenant_id) => {
  return `${internal_item_name.toLowerCase()}-${tenant_id}`;
};

export const validateItems = (data, skipHeader = true, itemsTypes, fetchedItems) => {
  // Fetch items from React Query


  // Track existing items from fetched data
  let existingItems = new Set();
  if (fetchedItems) {
    fetchedItems.forEach(item => {
      const itemKey = generateItemKey(item.internal_item_name, item.tenant_id);
      existingItems.add(itemKey);
    });
  }

  // If skipHeader is true, remove the first row (assumed to be headers)
  const processedData = skipHeader ? data.slice(1) : data;
  console.log('Item Types', itemsTypes);

  // Validate each row and return with validation status
  return processedData.map((row, index) => {
    const validationResult = validateSingleItem(row, itemsTypes, existingItems);

    // Return the row number (index + 1 or index + 2 depending on skipHeader) and the validation reason
    return {
      rowNumber: skipHeader ? index + 2 : index + 1, // Row number is 1-based index
      row: row,
      reason: validationResult.reason, // Reason is the validation error message
      isValid: validationResult.isValid, // Validation status (true/false)
    };
  });
};

export const validateSingleItem = (row, itemsTypes, existingItems) => {
  // Ensure row is an array and has enough elements
  if (!Array.isArray(row) || row.length < 6) {
    console.log("Error: Insufficient data columns");
    return {
      isValid: false,
      reason: "Insufficient data columns",
    };
  }

  const [
    id,
    internal_item_name,
    tenant_id,
    ,
    type,
    uom,
    min_buffer,
    max_buffer,
    ,
    ,
    ,
    ,
    ,
    avg_weight_needed,
    additional_attributes__scrap_type,
  ] = row;

  const itemIds = Object.keys(itemsTypes);
  console.log(itemsTypes, itemIds);
  const errors = [];

  // 1. **Mandatory fields check**
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!tenant_id) missingFields.push("tenant_id");
  if (!uom) missingFields.push("uom");
  if (avg_weight_needed === undefined) missingFields.push("avg_weight_needed");

  if (missingFields.length > 0) {
    const errorMsg = `Missing mandatory fields: ${missingFields.join(", ")}`;
    console.log(errorMsg); // Console log for missing fields
    errors.push(errorMsg);
  }

  if (itemIds.includes(id.toString())) {
    errors.push('Already exist');
  }
  console.log(itemIds);

  // 2. **Check internal_item_name (handle non-string cases)**
  const safeItemName =
    typeof internal_item_name === "string"
      ? internal_item_name.trim()
      : (internal_item_name ?? "").toString().trim();

  if (!safeItemName) {
    const errorMsg = "Internal item name is mandatory";
    console.log(errorMsg); // Console log for internal item name issue
    errors.push(errorMsg);
  }

  console.log(safeItemName, " safe Item name");

  // 3. **Check for uniqueness of internal_item_name + tenant_id**
  const itemKey = generateItemKey(safeItemName, tenant_id);

  if (existingItems.has(itemKey)) {
    const errorMsg = `Item with internal item name '${safeItemName}' already exists for tenant ${tenant_id}`;
    console.log(errorMsg); // Console log for uniqueness check failure
    errors.push(errorMsg);
  } else {
    existingItems.add(itemKey); // Track for uniqueness using a Set
  }

  // 4. **Validate type (convert to lowercase and handle non-string cases)**
  const safeType =
    typeof type === "string"
      ? type.toLowerCase()
      : (type ?? "").toString().toLowerCase();

  if (!Object.values(ITEM_TYPES).includes(safeType)) {
    const errorMsg = `Invalid type. Must be one of: ${Object.values(
      ITEM_TYPES
    ).join(", ")}`;
    console.log(errorMsg); // Console log for invalid type
    errors.push(errorMsg);
  }

  // 5. **Validate UoM (convert to lowercase and handle non-string cases)**
  const safeUom =
    typeof uom === "string"
      ? uom.toLowerCase()
      : (uom ?? "").toString().toLowerCase();

  if (!Object.values(UOM_TYPES).includes(safeUom)) {
    const errorMsg = `Invalid UoM. Must be one of: ${Object.values(
      UOM_TYPES
    ).join(", ")}`;
    console.log(errorMsg); // Console log for invalid UoM
    errors.push(errorMsg);
  }

  // 6. **Validate avg_weight_needed (should be boolean)**
  const safeAvgWeightNeeded =
    avg_weight_needed === true ||
      avg_weight_needed === false ||
      ["true", "false"].includes(avg_weight_needed?.trim()?.toLowerCase())
      ? avg_weight_needed
      : null;

  if (safeAvgWeightNeeded === null) {
    const errorMsg = "Avg weight needed must be a boolean";
    console.log(errorMsg); // Console log for invalid avg_weight_needed
    errors.push(errorMsg);
  }

  // 7. **Validate additional_attributes__scrap_type for SELL type**
  if (
    safeType === ITEM_TYPES.SELL &&
    (!additional_attributes__scrap_type ||
      additional_attributes__scrap_type.toString().trim() === "")
  ) {
    const errorMsg = "Scrap type is mandatory for sell type items";
    console.log(errorMsg); // Console log for missing scrap type
    errors.push(errorMsg);
  }

  // 8. **Buffer validations for SELL and PURCHASE**
  const minBufferVal = min_buffer ? parseFloat(min_buffer) : 0;
  const maxBufferVal = max_buffer ? parseFloat(max_buffer) : 0;

  if (safeType !== ITEM_TYPES.COMPONENT) {
    // Ensure min_buffer for SELL and PURCHASE is not null, undefined, or negative
    if (
      min_buffer === null ||
      min_buffer === undefined ||
      isNaN(minBufferVal) ||
      minBufferVal < 0
    ) {
      const errorMsg =
        "Minimum buffer is mandatory for sell and purchase types and cannot be negative";
      console.log(errorMsg); // Console log for invalid min_buffer
      errors.push(errorMsg);
    }

    // Ensure max_buffer is not negative and is greater than or equal to min_buffer
    if (
      !isNaN(minBufferVal) &&
      !isNaN(maxBufferVal) &&
      (maxBufferVal < 0 || maxBufferVal < minBufferVal)
    ) {
      const errorMsg =
        "Maximum buffer must be greater than or equal to minimum buffer and cannot be negative";
      console.log(errorMsg); // Console log for invalid max_buffer
      errors.push(errorMsg);
    }
  }

  return {
    isValid: errors.length === 0,
    reason: errors.length > 0 ? errors.join(". ") : "",
  };
};