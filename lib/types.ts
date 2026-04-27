export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type FullArticle = {
  id: string;
  url: string;
  title: string;
  content: string | null;
  thumbnail_url: string | null;
  source: string | null;
  author: string | null;
  is_read: boolean;
  saved_at: string;
  tags: Tag[];
};

export type Article = {
  id: string;
  url: string;
  title: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  source: string | null;
  author: string | null;
  is_read: boolean;
  saved_at: string;
  tags: Tag[];
};
