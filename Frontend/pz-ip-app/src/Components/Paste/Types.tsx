import { User } from "../../Types/Types";

export interface PasteInfo {
  id: number;
  title: string;
  author: any;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  likeCount: number;
  isLiked: boolean;
}

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

export type LocalFileDelta = {
  added: AddedAttachment[];
  unchanged: Attachment[];
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
