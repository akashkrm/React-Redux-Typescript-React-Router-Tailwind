import { useDispatch, useSelector } from "react-redux";
import { Card, RootState } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { addCard, deleteBoard, updateCard } from "../store/boardsSlice";
import toast from "react-hot-toast";

export default function BoardDetails() {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const board = useSelector((state: RootState) =>
    boardId ? state.boards.items[boardId] : null
  );

  const dispatch = useDispatch();

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  function handleAddCard(e: React.FormEvent) {
  e.preventDefault();

  if (newCardTitle.trim() && boardId) {
    const newCard: Card = {
      id: crypto.randomUUID(),
      title: newCardTitle,
      description: "",
      status: "todo",
      createAt: new Date().toISOString(),
    };

    dispatch(addCard({ boardId, card: newCard }));
    toast.success("Card added.")
    setNewCardTitle("");
    setIsAddingCard(false);
  }
}


  function handleDeleteBoard() {
    if (window.confirm("Are you sure you want to delete this board?")) {
      dispatch(deleteBoard(boardId!));
      toast.success("Board deleted successfully!")
      navigate("/boards");
    }
  }

  // Start the Drag
  function handleDragStart(card: Card) {
    setDraggedCard(card);
  }

  // Allow to drop
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  // Drag/Drop Functionality
  function handleDrop(status: Card["status"]) {
    if (draggedCard && boardId && status !== draggedCard.status) {
      const updatedCard: Card = {
        ...draggedCard,
        status,
      };
      dispatch(updateCard({ boardId, card: updatedCard }));
      setDraggedCard(null);
    }
  }

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return !board ? (
    <section className="grid justify-center gap-8">
      <h1
        className="text-2xl text-primary font-bold
      text-center"
      >
        Board Not Found
      </h1>
      <button
        className="border border-primary px-4 py-2 rounded-sm"
        onClick={() => navigate("/boards")}
      >
        Back to Boards
      </button>
    </section>
  ) : (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-6 items-start md:flex-row md:items-center">
          <button
            className="p-2 bg-primary rounded-full"
            onClick={() => navigate("/boards")}
          >
            <ArrowLeft className="size-4 text-dark" />
          </button>

          <h1 className="text-4xl font-bold text-primary text-center">
            {board.title}
          </h1>
        </div>

        <div className="flex flex-col gap-4 *:grow *:px-4 *:py-2 *:rounded-sm *:border *:border-primary *:flex *:gap-4 *:justify-center 500px:flex-row md:self-center">
          <button onClick={() => setIsAddingCard(true)}>
            <Plus /> Add Card
          </button>
          <button onClick={handleDeleteBoard}>
            <Trash2 /> Delete Board
          </button>
        </div>
      </div>

      {isAddingCard && (
        <form
          onSubmit={handleAddCard}
          className="flex flex-col gap-4 max-w-screen-500px"
        >
          <input
            className="bg-primary text-dark px-4 py-2 rounded-sm placeholder:text-gray-600 outline-none"
            type="text"
            placeholder="Card Title"
            onChange={(e) => setNewCardTitle(e.target.value)}
            value={newCardTitle}
          />
          <div className="flex gap-2 *:grow *:px-4 *:py-2 *:rounded-sm *:border *:border-primary">
            <button type="button" onClick={() => setIsAddingCard(false)}>
              Cancel
            </button>
            <button type="submit">Add</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 grid-cols-1 500px:grid-cols-2 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id as Card["status"])}
            className={`flex flex-col gap-4 items-start bg-dark-lighter rounded-sm p-4 ${
              draggedCard ? "border-2 border-dashed border-primary/50" : ""
            }`}
          >
            <h2 className="text-2xl font-extrabold text-primary">
              {col.title}
            </h2>

            <div className="flex flex-wrap gap-2 *:bg-primary-light *:text-dark *:p-4 *:rounded-sm *:space-y-2">
              {board.cards
                .filter((card) => card.status === col.id)
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card)}
                    className={`cursor-move ${
                      draggedCard?.id === card.id ? "opacity-50" : ""
                    }`}
                    onClick={() =>
                      navigate(`/boards/${boardId}/card/${card.id}`)
                    }
                  >
                    <h3 className="font-bold">{card.title}</h3>
                    <p className="text-sm text-dark-light">
                      {new Date(card.createAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
