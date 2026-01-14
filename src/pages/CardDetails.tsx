import { useDispatch, useSelector } from "react-redux";
import { Card, RootState } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCard, updateCard } from "../store/boardsSlice";
import toast from "react-hot-toast";

export default function CardDetails() {
  const { boardId = "", cardId = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const card = useSelector((state: RootState) => {
    const board = state.boards.items[boardId];
    return board.cards.find((card) => card.id === cardId);
  });

  const [title, setTitle] = useState(card!.title);
  const [description, setDescription] = useState(card!.description);
  const [status, setStatus] = useState(card!.status);

  function handleSave() {
    const updatedCard: Card = {
      id: card!.id,
      title,
      description,
      status,
      createAt: card!.createAt,
    };
    dispatch(updateCard({ boardId, card: updatedCard }));
    toast.success("Card Updated Sucessfully")
    navigate(`/boards/${boardId}`);
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this card?")) {
      dispatch(deleteCard({ boardId, cardId }));
      navigate(`/boards/${boardId}`);
    }
  }

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-6 items-start md:flex-row md:items-center">
          <button
            className="p-2 bg-primary rounded-full"
            onClick={() => navigate(`/boards/${boardId}`)}
          >
            <ArrowLeft className="size-4 text-dark" />
          </button>
        </div>

        <div className="flex flex-col gap-4 *:grow *:px-4 *:py-2 *:rounded-sm *:border *:border-primary *:flex *:gap-4 *:justify-center 500px:flex-row md:self-center">
          <button onClick={handleSave}>
            <Save /> Save Changes
          </button>
          <button onClick={handleDelete}>
            <Trash2 /> Delete Card
          </button>
        </div>
      </div>

      <form className="flex flex-col gap-4  max-w-screen-500px">
        <div className="flex flex-col gap-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="bg-primary text-dark px-4 py-2 rounded-sm placeholder:text-gray-600 outline-none"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="bg-primary text-dark px-4 py-2 rounded-sm placeholder:text-gray-600 outline-none h-48"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            className="bg-dark border border-primary px-4 py-2 rounded-sm cursor-pointer text-sm"
            onChange={(e) => setStatus(e.target.value as Card["status"])}
            value={status}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <p className="text-xl font-bold text-primary">
          Created: {new Date(card!.createAt).toLocaleString()}
        </p>
      </form>
    </section>
  );
}
