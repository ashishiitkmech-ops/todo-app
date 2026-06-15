"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
  dueDate: string; // stored as "YYYY-MM-DD", empty string means no date set
};

// Helper: is a date in the past?
function isOverdue(dueDate: string, done: boolean): boolean {
  if (!dueDate || done) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Load tasks from localStorage when the page first opens
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage every time the list changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks([...tasks, { id: Date.now(), text: trimmed, done: false, dueDate }]);
    setInput("");
    setDueDate("");
  }

  function toggleTask(id: number) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My To-Do List</h1>

        {/* Input area */}
        <div className="flex flex-col gap-2 mb-6">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <div className="flex gap-2">
            {/* Date picker — lets you choose a due date */}
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              onClick={addTask}
            >
              Add
            </button>
          </div>
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks yet — add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className={`text-gray-800 ${task.done ? "line-through text-gray-400" : ""}`}>
                    {task.text}
                  </p>
                  {task.dueDate && (
                    <p
                      className={`text-xs mt-0.5 ${
                        isOverdue(task.dueDate, task.done)
                          ? "text-red-500 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      {isOverdue(task.dueDate, task.done) ? "Overdue · " : "Due · "}
                      {new Date(task.dueDate + "T00:00:00").toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg leading-none shrink-0"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
