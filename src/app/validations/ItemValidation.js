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






const generateItemKey = (internal_item_name, tenant_id) => {
  return `${internal_item_name.toLowerCase()}-${tenant_id}`;
};

export const validateItems = (data, skipHeader = true, itemsTypes, fetchedItems) => {

  


  let existingItems = new Set();
  if (fetchedItems) {
    fetchedItems.forEach(item => {
      const itemKey = generateItemKey(item.internal_item_name, item.tenant_id);
      existingItems.add(itemKey);
    });
  }


  const processedData = skipHeader ? data.slice(1) : data;
  console.log('Item Types', itemsTypes);


  return processedData.map((row, index) => {
    const validationResult = validateSingleItem(row, itemsTypes, existingItems);


    return {
      rowNumber: skipHeader ? index + 2 : index + 1, 
      row: row,
      reason: validationResult.reason, 
      isValid: validationResult.isValid, 
    };
  });
};

export const validateSingleItem = (row, itemsTypes, existingItems) => {

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


  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!tenant_id) missingFields.push("tenant_id");
  if (!uom) missingFields.push("uom");
  if (avg_weight_needed === undefined) missingFields.push("avg_weight_needed");

  if (missingFields.length > 0) {
    const errorMsg = `Missing mandatory fields: ${missingFields.join(", ")}`;
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  if (itemIds.includes(id.toString())) {
    errors.push('Already exist');
  }
  console.log(itemIds);

  const safeItemName =
    typeof internal_item_name === "string"
      ? internal_item_name.trim()
      : (internal_item_name ?? "").toString().trim();

  if (!safeItemName) {
    const errorMsg = "Internal item name is mandatory";
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  console.log(safeItemName, " safe Item name");


  const itemKey = generateItemKey(safeItemName, tenant_id);

  if (existingItems.has(itemKey)) {
    const errorMsg = `Item with internal item name '${safeItemName}' already exists for tenant ${tenant_id}`;
    console.log(errorMsg); 
    errors.push(errorMsg);
  } else {
    existingItems.add(itemKey); 
  }

  const safeType =
    typeof type === "string"
      ? type.toLowerCase()
      : (type ?? "").toString().toLowerCase();

  if (!Object.values(ITEM_TYPES).includes(safeType)) {
    const errorMsg = `Invalid type. Must be one of: ${Object.values(
      ITEM_TYPES
    ).join(", ")}`;
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  const safeUom =
    typeof uom === "string"
      ? uom.toLowerCase()
      : (uom ?? "").toString().toLowerCase();

  if (!Object.values(UOM_TYPES).includes(safeUom)) {
    const errorMsg = `Invalid UoM. Must be one of: ${Object.values(
      UOM_TYPES
    ).join(", ")}`;
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  const safeAvgWeightNeeded =
    avg_weight_needed === true ||
      avg_weight_needed === false ||
      ["true", "false"].includes(avg_weight_needed?.trim()?.toLowerCase())
      ? avg_weight_needed
      : null;

  if (safeAvgWeightNeeded === null) {
    const errorMsg = "Avg weight needed must be a boolean";
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  if (
    safeType === ITEM_TYPES.SELL &&
    (!additional_attributes__scrap_type ||
      additional_attributes__scrap_type.toString().trim() === "")
  ) {
    const errorMsg = "Scrap type is mandatory for sell type items";
    console.log(errorMsg); 
    errors.push(errorMsg);
  }

  const minBufferVal = min_buffer ? parseFloat(min_buffer) : 0;
  const maxBufferVal = max_buffer ? parseFloat(max_buffer) : 0;

  if (safeType !== ITEM_TYPES.COMPONENT) {
    if (
      min_buffer === null ||
      min_buffer === undefined ||
      isNaN(minBufferVal) ||
      minBufferVal < 0
    ) {
      const errorMsg =
        "Minimum buffer is mandatory for sell and purchase types and cannot be negative";
      console.log(errorMsg); 
      errors.push(errorMsg);
    }

    if (
      !isNaN(minBufferVal) &&
      !isNaN(maxBufferVal) &&
      (maxBufferVal < 0 || maxBufferVal < minBufferVal)
    ) {
      const errorMsg =
        "Maximum buffer must be greater than or equal to minimum buffer and cannot be negative";
      console.log(errorMsg); 
      errors.push(errorMsg);
    }
  }

  return {
    isValid: errors.length === 0,
    reason: errors.length > 0 ? errors.join(". ") : "",
  };
};