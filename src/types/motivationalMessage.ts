export interface MotivationalMessage {
  id: string;
  text: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MotivationalMessageInput {
  text: string;
  isFavorite?: boolean;
}
