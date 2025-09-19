"use client";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./components/header";
import { createLog } from "../app/lib/log-action";
import { useSession, signIn } from "next-auth/react";

interface DailyLog {
  water: number;
  steps: number;
  sleep: number;
  outdoors: number;
  activity: number;
  cookedAtHome: boolean;
  eatingOutCost: number;
  emotion: string; // new!
  notes: string; // new!
}

const initialLog: DailyLog = {
  water: 0,
  steps: 0,
  sleep: 0,
  outdoors: 0,
  activity: 0,
  cookedAtHome: false,
  eatingOutCost: 0,
  emotion: "😐",
  notes: "",
};

export default function Home() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState<DailyLog>(initialLog);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(() => {
    const dateParam = searchParams?.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return new Date();
  });
  const leafContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dateParam = searchParams?.get('date');
    if (!dateParam) {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [searchParams]);

  const formatDateOnly = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const formatDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${mm}/${dd}/${yyyy}, ${hh}:${min}:${ss}`;
  };

  const handleChange =
    (field: keyof Omit<DailyLog, "emotion" | "notes">) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "cookedAtHome" ? e.target.checked : Number(e.target.value);
      setLog((prev) => ({ ...prev, [field]: value }));
    };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return alert("Registration failed");
      await signIn("credentials", { redirect: false, username, password });
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      if (res?.error) alert("Login failed");
    }
  };

  if (loading) return <div className="p-4">Checking session…</div>;

  const handleEmotionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLog((prev) => ({ ...prev, emotion: e.target.value }));
  };

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLog((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createLog(formData);
      // now clear everything
      setLog(initialLog);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const container = leafContainerRef.current;
    if (!container) return;

    const createLeaf = () => {
      const leaf = document.createElement("img");
      leaf.src = "/leaves.png"; // Ensure this is in your public folder
      leaf.className = "leaf-animation";

      // Randomize vertical start position and scale
      leaf.style.position = "absolute";
      leaf.style.top = `${Math.random() * 80}%`; // Random vertical start
      leaf.style.left = `-50px`;
      leaf.style.width = `${20 + Math.random() * 20}px`;
      leaf.style.opacity = `${0.7 + Math.random() * 0.3}`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg)`;

      // Add animation
      leaf.style.animation = `fly-across ${
        8 + Math.random() * 4
      }s linear forwards`;

      container.appendChild(leaf);
      leaf.addEventListener("animationend", () => leaf.remove());
    };

    const interval = setInterval(createLeaf, 500);
    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleAuth}
          className="p-8 bg-white rounded shadow-md space-y-4 w-80"
        >
          <h2 className="text-2xl text-center">
            {isRegister ? "Register" : "Log In"}
          </h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded border-sky-500 text-sky-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded border-blue border-sky-500 text-sky-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {isRegister ? "Create Account" : "Log In"}
          </button>
          <p className="text-center text-sm">
            {isRegister ? "Already have one?" : "No account yet?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 underline"
            >
              {isRegister ? "Log In" : "Register"}
            </button>
          </p>
        </form>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen sm:aspect-[4/3] border-[5px] sm:border-[10px] border-[#333] overflow-y-auto overflow-x-hidden pixelated relative">
      {/* Header and Title */}
      <Header />
      <div className="flex flex-col sm:flex-row h-auto sm:h-[8vh] justify-between items-center px-2 sm:px-0 py-2 sm:py-0">
        <img
          src="/sun_shiny.png"
          className="flex justify-start w-20 h-20 sm:w-40 sm:h-40 pixelated z-10"
          alt="Shiny Sun"
        />
        <h1 className="title text-lg sm:text-xl z-11 order-first sm:order-none">Daily Log</h1>
        <h1
          style={{ color: "white" }}
          className="text-sm sm:text-2xl z-20 flex justify-end text-center sm:text-right"
        >
          {formatDate(now)}
        </h1>
      </div>

      {/* Sun */}

      {/* Clouds */}
      <img
        src="/C2010.png"
        className="absolute top-[5%] left-[5%] w-36 h-20 sm:w-72 sm:h-40 opacity-90 animate-cloud-slow pixelated"
      />
      <img
        src="/C2011.png"
        className="absolute top-[10%] left-[20%] w-44 h-24 sm:w-88 sm:h-48 opacity-80 animate-cloud pixelated"
      />
      <img
        src="/C2011.png"
        className="absolute top-[15%] left-[40%] w-32 h-18 sm:w-64 sm:h-36 opacity-85 animate-cloud-fast pixelated scale-x-[-1]"
      />
      <img
        src="/C2010.png"
        className="absolute top-[20%] left-[60%] w-40 h-22 sm:w-80 sm:h-44 opacity-75 animate-cloud pixelated"
      />
      <img
        src="/C2011.png"
        className="absolute top-[25%] left-[75%] w-48 h-26 sm:w-96 sm:h-52 opacity-80 animate-cloud-slow pixelated"
      />
      <img
        src="/C2010.png"
        className="absolute top-[30%] left-[10%] w-38 h-20 sm:w-76 sm:h-40 opacity-70 animate-cloud pixelated"
      />
      <img
        src="/C2011.png"
        className="absolute top-[35%] left-[50%] w-42 h-22 sm:w-84 sm:h-44 opacity-85 animate-cloud-fast pixelated scale-x-[-1]"
      />
      <img
        src="/C2010.png"
        className="absolute top-[40%] left-[30%] w-36 h-20 sm:w-72 sm:h-40 opacity-90 animate-cloud pixelated"
      />
      <img
        src="/C2011.png"
        className="absolute top-[45%] left-[70%] w-50 h-28 sm:w-100 sm:h-56 opacity-80 animate-cloud-slow pixelated"
      />
      {/* Additional clouds in the middle - hidden on mobile */}
      <img
        src="/C2010.png"
        className="hidden sm:block absolute top-[8%] left-[35%] w-68 h-36 opacity-75 animate-cloud pixelated"
      />
      <img
        src="/C2011.png"
        className="hidden sm:block absolute top-[18%] left-[55%] w-72 h-40 opacity-70 animate-cloud-slow pixelated scale-x-[-1]"
      />
      <img
        src="/C2010.png"
        className="hidden sm:block absolute top-[28%] left-[45%] w-76 h-42 opacity-80 animate-cloud-fast pixelated"
      />
      <img
        src="/C2011.png"
        className="hidden sm:block absolute top-[38%] left-[55%] w-80 h-44 opacity-75 animate-cloud pixelated"
      />

      <div className="flex justify-center z-10 px-2 sm:px-0">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/75 z-20 p-3 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md space-y-2 sm:space-y-3"
        >
          <input type="hidden" name="date" value={formatDate(now)} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            <label
              className="text-white font-bold text-sm sm:text-lg mb-1 sm:whitespace-nowrap flex-1"
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
              className="w-full sm:w-1/4 p-1 sm:p-2 rounded bg-slate-700 border-solid border-2 border-white text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            <label
              className="text-white font-bold text-sm sm:text-lg mb-1 sm:whitespace-nowrap flex-1"
              htmlFor="steps"
            >
              Steps
            </label>
            <input
              id="steps"
              name="steps"
              type="number"
              value={log.steps}
              onChange={handleChange("steps")}
              className="w-full sm:w-1/4 p-1 sm:p-2 rounded bg-slate-700 border-solid border-2 border-white text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-white">
            <label
              className="text-white font-bold text-sm sm:text-lg mb-1 sm:whitespace-nowrap flex-1"
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
              className="w-full sm:w-1/4 p-1 sm:p-2 rounded bg-slate-700 border-solid border-2 border-white text-blue text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            <label
              className="text-white font-bold text-sm sm:text-lg mb-1 flex-1"
              htmlFor="outdoors"
            >
              Time Spent Outdoors (mins)
            </label>
            <input
              id="outdoors"
              name="outdoors"
              type="number"
              value={log.outdoors}
              onChange={handleChange("outdoors")}
              className="w-full sm:w-1/4 p-1 sm:p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            <label
              className="text-white font-bold text-sm sm:text-lg mb-1 flex-1"
              htmlFor="activity"
            >
              Physical Activity (mins)
            </label>
            <input
              id="activity"
              name="activity"
              type="number"
              value={log.activity}
              onChange={handleChange("activity")}
              className="w-full sm:w-1/4 p-1 sm:p-2 rounded bg-slate-700 text-white border-solid border-2 border-white text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="w-full sm:w-1/2 text-white font-bold text-sm sm:text-lg">
              Cooked at Home?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setLog((prev) => ({ ...prev, cookedAtHome: true }))
                }
                className={`px-2 sm:px-3 py-1 border rounded text-sm sm:text-base ${
                  log.cookedAtHome
                    ? "bg-green-500 text-white"
                    : "text-white font-bold"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setLog((prev) => ({ ...prev, cookedAtHome: false }))
                }
                className={`px-2 sm:px-3 py-1 border rounded text-sm sm:text-base ${
                  log.cookedAtHome === false
                    ? "bg-green-500 text-white"
                    : "text-gray-200"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Conditional Restaurant Cost */}
          {!log.cookedAtHome && (
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
              <label className="w-full sm:w-1/2 text-gray-200 text-sm sm:text-base" htmlFor="eatingOutCost">
                $ Spent at Restaurant
              </label>
              <input
                id="eatingOutCost"
                name="eatingOutCost"
                type="number"
                step="0.01"
                value={log.eatingOutCost}
                onChange={handleChange("eatingOutCost")}
                className="w-full sm:w-1/2 p-1 sm:p-2 rounded bg-slate-700 text-white focus:outline-indigo-400 text-sm sm:text-base"
              />
            </div>
          )}

          <div className="space-y-2">
            <span className="text-gray-200 text-sm sm:text-base">How do you feel today?</span>
            <div className="flex justify-between space-x-2 sm:space-x-4">
              {[
                { label: "😢", title: "Very unhappy" },
                { label: "🙁", title: "A little unhappy" },
                { label: "😐", title: "Neutral" },
                { label: "🙂", title: "A little happy" },
                { label: "😄", title: "Great" },
              ].map(({ label, title }) => (
                <label key={label} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name="emotion"
                    value={label}
                    checked={log.emotion === label}
                    onChange={handleEmotionChange}
                    className="peer sr-only"
                  />
                  <span
                    className="cursor-pointer text-2xl sm:text-4xl peer-checked:scale-125 peer-checked:opacity-100 opacity-60 transition"
                    title={title}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Free-form notes */}
          <div className="flex flex-col">
            <label className="text-yellow-800 mb-1 text-sm sm:text-base" htmlFor="notes">
              Journal Entry
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={log.notes}
              onChange={handleNotesChange}
              placeholder="Write your thoughts here…"
              className="resize-y focus:outline-none text-yellow-900 font-focus:ring-0 tracking-wide font-diary p-2 sm:p-4 bg-yellow-50 bg-opacity-80 placeholder-yellow-600 placeholder-opacity-70 border-2 border-yellow-300 rounded-lg shadow-inner italic text-sm sm:text-base"
            />
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-500 text-sm sm:text-base"
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
          className="absolute bottom-10 left-4 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 1.png"
          className="absolute bottom-20 left-50 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 2.png"
          className="absolute bottom-30 left-90 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 2.png"
          className="absolute bottom-30 left-120 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.0.png"
          className="absolute bottom-30 right-120 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.0.png"
          className="absolute bottom-20 right-90 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.1.png"
          className="absolute bottom-20 right-50 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 4.png"
          className="absolute bottom-10 right-20 w-30 h-50 sm:w-60 sm:h-100 pixelated z-10"
        />
        {/* Additional trees in the middle - hidden on mobile */}
        <img
          src="/Green Trees/Tree 1.png"
          className="hidden sm:block absolute bottom-25 left-1/3 w-60 h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 2.png"
          className="hidden sm:block absolute bottom-15 left-1/2 w-60 h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 3.0.png"
          className="hidden sm:block absolute bottom-35 right-1/3 w-60 h-100 pixelated z-10"
        />
        <img
          src="/Green Trees/Tree 4.png"
          className="hidden sm:block absolute bottom-25 right-1/2 w-60 h-100 pixelated z-10"
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
