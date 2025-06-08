"use client";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import Header from "./components/header";
import { createLog } from "../app/lib/log-action";

interface DailyLog {
  water: number;
  sleep: number;
  outdoors: number;
  activity: number;
  cookedAtHome: boolean;
  eatingOutCost: number;
}

export default function Home() {
  const [log, setLog] = useState<DailyLog>({
    water: 0,
    sleep: 0,
    outdoors: 0,
    activity: 0,
    cookedAtHome: false,
    eatingOutCost: 0,
  });
  const [saving, setSaving] = useState(false);

  const handleChange =
    (field: keyof DailyLog) => (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "cookedAtHome" ? e.target.checked : Number(e.target.value);
      setLog((prev) => ({ ...prev, [field]: value }));
    };

  const leafContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = leafContainerRef.current;
    if (!container) return;

    const createLeaf = () => {
      const leaf = document.createElement("svg");
      leaf.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="1" width="2" height="1" fill="#FF69B4" />
          <rect x="4" y="2" width="4" height="1" fill="#FF69B4" />
          <rect x="3" y="3" width="6" height="1" fill="#FF69B4" />
          <rect x="4" y="4" width="4" height="1" fill="#FF69B4" />
          <rect x="5" y="5" width="2" height="1" fill="#FF69B4" />
        </svg>
      `;
      leaf.className = "absolute w-6 h-6 pixelated animate-petal";
      leaf.style.top = `${50 + Math.random() * 20 - 10}%`; // Center range: 40%–60%
      leaf.style.left = "-15px";
      container.appendChild(leaf);

      leaf.addEventListener("animationend", () => leaf.remove());
    };

    const interval = setInterval(createLeaf, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen aspect-[4/3] border-[10px] border-[#333] overflow-hidden pixelated relative">
      {/* Header and Title */}
      <Header />
      <h1 className="title z-11">Daily Log</h1>

      {/* Sun */}
      <img
        src="/sun_shiny.png"
        className="absolute top-4 right-4 w-12 h-12 pixelated z-10"
        alt="Shiny Sun"
      />

      {/* Clouds */}
      <img
        src="/C2010.png"
        className="absolute top-10 right-20 w-15 h-10 pixelated animate-cloud"
      />
      <img
        src="/C2011.png"
        className="absolute top-60 right-40 w-15 h-10 pixelated animate-cloud"
      />

      <div className="absolute flex z-10 left-[639px] top-[345px]">
        <form
          action={createLog}
          className="bg-slate-800/75 p-6 rounded-lg shadow-lg w-full max-w-md space-y-6"
        >
          <div className="flex flex-row pb-3">
            <label
              className="text-gray-200 mb-1 whitespace-nowrap"
              htmlFor="water"
            >
              Water (oz)
            </label>
            <input
              id="water"
              name="water"
              type="number"
              value={log.water}
              onChange={handleChange("water")}
              className="w-1/4 p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-white"
            />
          </div>

          <div className="flex flex-row pb-3 text-white">
            <label
              className="text-gray-200 mb-1 whitespace-nowrap"
              htmlFor="sleep"
            >
              Sleep (hrs)
            </label>
            <input
              id="sleep"
              name="sleep"
              type="number"
              value={log.sleep}
              onChange={handleChange("sleep")}
              className="w-1/4 p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-white"
            />
          </div>

          <div className="flex flex-row pb-3">
            <label className="text-gray-200 mb-1" htmlFor="outdoors">
              Time Spent Outdoors (mins)
            </label>
            <input
              id="outdoors"
              name="outdoors"
              type="number"
              value={log.outdoors}
              onChange={handleChange("outdoors")}
              className="w-1/4 p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-white"
            />
          </div>

          <div className="flex flex-row pb-3">
            <label className="text-gray-200 mb-1" htmlFor="activity">
              Physical Activity (mins)
            </label>
            <input
              id="activity"
              name="activity"
              type="number"
              value={log.activity}
              onChange={handleChange("activity")}
              className="w-1/4 p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-white"
            />
          </div>

          <div className="flex flex-row items-center gap-4">
            <span className="w-1/2 text-gray-200">Cooked at Home?</span>
            <button
              type="button"
              onClick={() =>
                setLog((prev) => ({ ...prev, cookedAtHome: true }))
              }
              className={`px-3 py-1 border rounded ${
                log.cookedAtHome ? "bg-green-500 text-white" : "text-gray-200"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() =>
                setLog((prev) => ({ ...prev, cookedAtHome: false }))
              }
              className={`px-3 py-1 border rounded ${
                log.cookedAtHome === false
                  ? "bg-green-500 text-white"
                  : "text-gray-200"
              }`}
            >
              No
            </button>
          </div>

          {/* Conditional Restaurant Cost */}
          {!log.cookedAtHome && (
            <div className="flex flex-row gap-4">
              <label className="w-1/2 text-gray-200" htmlFor="eatingOutCost">
                $ Spent at Restaurant
              </label>
              <input
                id="eatingOutCost"
                name="eatingOutCost"
                type="number"
                step="0.01"
                value={log.eatingOutCost}
                onChange={handleChange("eatingOutCost")}
                className="w-1/2 p-2 rounded bg-slate-700 text-white focus:outline-indigo-400"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-500"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Ground and Trees */}
      <div className="ground">
        <img
          src="/Green Trees/Tree 1.png"
          className="absolute bottom-0 left-4 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 1.png"
          className="absolute bottom-0 left-20 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 2.png"
          className="absolute bottom-0 left-36 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 2.png"
          className="absolute bottom-0 left-52 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.png"
          className="absolute bottom-0 right-52 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.png"
          className="absolute bottom-0 right-36 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.1.png"
          className="absolute bottom-0 right-20 w-16 h-24 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 4.png"
          className="absolute bottom-0 right-4 w-16 h-24 pixelated z-10"
        />
      </div>

      {/* Leaves */}
      <div
        ref={leafContainerRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
