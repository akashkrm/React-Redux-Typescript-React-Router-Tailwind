import { Layout, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../types";
import { createBoard } from "../store/boardsSlice";
import toast from "react-hot-toast";

export default function BoardsList() {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards.items);

  function handleCreateBoard(e: React.FormEvent) {
  e.preventDefault();

  if (newBoardTitle.trim()) {
    const id = crypto.randomUUID();
    dispatch(createBoard({ id, title: newBoardTitle }));
    toast.success("Board Created done!")
    setNewBoardTitle("");
    setIsCreating(false);
    navigate(`/boards/${id}`);
  }
}


  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 500px:flex-row 500px:justify-between">
        <h1 className="text-5xl font-bold text-[#E2E2E2] text-center">
          My Boards
        </h1>

        <button
          className="flex items-center justify-center gap-4 p-4 rounded-sm border border-primary font-bold"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="size-5" /> New Board
        </button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreateBoard}
          className="flex flex-col gap-4 max-w-screen-500px"
        >
          <input
            type="text"
            placeholder="Board Title"
            className="bg-primary text-dark px-4 py-2 rounded-sm placeholder:text-gray-600 outline-none"
            onChange={(e) => setNewBoardTitle(e.target.value)}
            value={newBoardTitle}
          />

          <div className="flex gap-2 *:grow *:px-4 *:py-2 *:rounded-sm *:border *:border-primary">
            <button type="button" onClick={() => setIsCreating(false)}>
              Cancel
            </button>

            <button type="submit">Create</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 grid-cols-1 500px:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.values(boards).map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/boards/${board.id}`)}
            className="cursor-pointer bg-primary text-dark rounded-sm px-6 py-4 flex flex-col items-center gap-4"
          >
            <div className="flex flex-col gap-4 items-center">
              <Layout className="size-8" />

              <h2 className="text-xl font-semibold">{board.title}</h2>
            </div>

            <p>{board.cards.length} Cards</p>
          </div>
        ))}
      </div>
    </section>
  );
}
