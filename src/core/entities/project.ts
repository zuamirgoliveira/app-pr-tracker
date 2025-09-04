export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  state: 'deleting' | 'new' | 'wellFormed' | 'createPending' | 'unchanged' | 'deleted';
  revision?: number;
  visibility?: 'private' | 'public';
  lastUpdateTime?: string;
}