import { User } from "../../Types/Types";

export interface PasteMeta {
  id: number;
  title: string;
  author: Author | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  expireDate: Date | null;
  isPrivate: boolean;
  likeCount: number;
  isLiked: boolean;
  isReported: boolean;
  reports: Report[];
  attachments: Attachment[];
  tags: string[];
}

export interface Paste extends PasteMeta {
  content: string;
  fileDelta: FileDelta;
}

export type Author = {
  id: number;
  username: string;
};

// This sucks
export type Attachment = {
  id: number;
  url: string;
  name: string;
  content: string;
  size: number;
  is_added: boolean;
  is_removed: boolean;
};

export type AddedAttachment = {
  name: string;
  content: string;
};

export type RemovedAttachment = {
  id: number;
};

export type FileDelta = {
  added: AddedAttachment[];
  removed: RemovedAttachment[];
};

export interface LocationState {
  returnTo: string;
  page: number;
  itemsPerPage: number;
}

export interface Report {
  id: number;
  pasteId: number;
  reporter: User;
  reason: string;
  createdAt: Date;
  reviewedBy: User;
}
