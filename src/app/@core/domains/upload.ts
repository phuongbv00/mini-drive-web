export interface Upload {
  title: string;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
}
