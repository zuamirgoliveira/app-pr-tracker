import { SearchType } from "./search-type-dto";

export interface ConnectionForm {
  organization: string;
  project?: string; // Opcional agora
  token: string;
  searchType: SearchType;
}