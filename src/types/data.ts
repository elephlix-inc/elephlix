export interface User {
  id: number;
  username: string;
  slug: string;
  email?: string;
  followers?: User[];
  createdAt: string;
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  slug: string;
  author: User;
  views: number;
  uploadedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  author: User;
  replies: Comment[];
}
