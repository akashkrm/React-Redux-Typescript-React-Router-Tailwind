export interface Card {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  createAt: string;
}

export interface Board {
  id: string;
  title: string;
  cards: Card[];
}

export interface RootState {
  boards: {
    items: Record<string, Board>;
    loading: boolean;
    error: string | null;
  };
}
