export const VALID_UOMS = ["kgs", "nos", "KG", "NOS"];
export const VALID_TYPES = ["sell", "purchase", "component"];
export const BASE_URL = "https://api-assignment.inveesync.in";
export const bomSchema = {
  id: "",
  item_id: "",
  component_id: "",
  quantity: "",
  created_by: "user2",
  last_updated_by: "user2",
  createdAt: "",
  updatedAt: "",
};
export const itemSchema = {
  id: "",
  internal_item_name: "",
  tenant_id : "",
  item_description: "",
  type: "",
  uom: "",
  min_buffer: "",
  max_buffer: "",
  created_by: "user1",
  last_updated_by: "user2",
  is_deleted : "",
  createdAt : "",
  updatedAt : "",
  additional_attributes: {
    drawing_revision_number: "",
    drawing_revision_date: "",
    avg_weight_needed: "",
    scrap_type: "",
    shelf_floor_alternate_name: "",
  },
};
