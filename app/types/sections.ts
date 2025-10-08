export interface SectionItem {
  id: number | null;
  [key: string]: any;
}

export interface Section {
  title?: string;
  items: SectionItem[];
}
