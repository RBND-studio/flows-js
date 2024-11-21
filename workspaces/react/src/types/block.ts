interface TourWait {
  interaction: string;
  element?: string;
  page?: { operator: string; value: string[] };
}

export interface Block {
  id: string;
  type: string;
  componentType?: string;
  data: Record<string, unknown>;
  exitNodes: string[];

  slotId?: string;
  slotIndex?: number;

  page_targeting_operator?: string;
  page_targeting_values?: string[];

  tourBlocks?: TourBlock[];
  currentTourIndex?: number;
}

export interface TourBlock {
  id: string;
  type: string;
  componentType?: string;
  data: Record<string, unknown>;

  slotId?: string;
  slotIndex?: number;

  page_targeting_operator?: string;
  page_targeting_values?: string[];

  tourWait?: TourWait;
}
