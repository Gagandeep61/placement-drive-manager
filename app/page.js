"use client";

import { useState, useEffect } from "react";
import Spinner from "../components/Spinner.js";
import ErrorAlert from "../components/ErrorAlert.js";
import EmptyState from "../components/EmptyState.js";
import DriveList from "../components/DriveList.js";
import DriveForm from "../components/DriveForm.js";

export default function Home() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDrives() {
    setError("");
    try {
      const res = await fetch("/api/drives");
      if (!res.ok) {
        throw new Error("Bad response");
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Not a list");
      }
      setDrives(data);
    } catch (err) {
      console.error("Could not load drives:", err);
      setError("Could not load drives. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // run once when page opens
  useEffect(() => {
    fetchDrives();
  }, []);

  function retry() {
    setLoading(true);
    fetchDrives();
  }

  // pick what to show in list area
  let listArea;
  if (loading) {
    listArea = <Spinner />;
  } else if (error) {
    listArea = <ErrorAlert message={error} onRetry={retry} />;
  } else if (drives.length === 0) {
    listArea = <EmptyState />;
  } else {
    listArea = <DriveList drives={drives} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Placement Drive Manager</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DriveForm onSuccess={fetchDrives} />
          </div>
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Saved drives</h2>
            {listArea}
          </div>
        </div>
      </div>
    </main>
  );
}
