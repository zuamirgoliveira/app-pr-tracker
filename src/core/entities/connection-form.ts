import { SearchType } from "./search-type";

export interface ConnectionForm {
  organization: string;
  project?: string; // Opcional agora
  token: string;
  searchType: SearchType;
}