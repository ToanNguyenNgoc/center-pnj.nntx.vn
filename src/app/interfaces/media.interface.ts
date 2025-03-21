export interface IMedia {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  name: string;
  file_name: string;
  mime_type: string;
  size: number | null;
  original_url: string;
}