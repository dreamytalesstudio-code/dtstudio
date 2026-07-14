import React, { useState, useEffect } from "react";
import { Save, Award, Users, Camera } from "lucide-react";
import { AdminMediaUpload } from "./AdminMediaUpload";

interface StatsType {
  weddings: number;
  couples: number;
  events: number;
  backgroundUrl?: string;
  polaroid1Url?: string;
  polaroid2Url?: string;
  filmFrame1Url?: string;
  filmFrame2Url?: string;
  filmFrame3Url?: string;
}

interface StatsSectionProps {
  initialStats: StatsType;
  onSave: (stats: StatsType) => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ initialStats, onSave }) => {
  const [stats, setStats] = useState<StatsType>(initialStats);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  const handleNumChange = (field: "weddings" | "couples" | "events", val: string) => {
    const parsed = parseInt(val, 10);
    setStats((prev) => ({ ...prev, [field]: isNaN(parsed) ? 0 : parsed }));
    setIsSaved(false);
  };

  const handleUrlChange = (field: keyof Omit<StatsType, "weddings" | "couples" | "events">, url: string) => {
    setStats((prev) => ({ ...prev, [field]: url }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stats);
    setIsSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-serif text-gold font-semibold">Vows &amp; Legacy Stats</h3>
          <p className="text-xs text-zinc-400">Edit the counters displayed in the stats section, upload a rich backdrop image, and customize Handcrafted Artistry images.</p>
        </div>
        <button
          type="submit"
          disabled={isSaved}
          className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            isSaved
              ? "bg-zinc-800 text-zinc-500 cursor-default"
              : "bg-gold hover:bg-gold-dark text-luxury-black font-semibold hover:text-white"
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaved ? "Saved" : "Apply Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Weddings Done */}
        <div className="space-y-1.5 bg-white/2 border border-white/5 p-4 rounded-lg">
          <label htmlFor="stats-weddings" className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-gold" /> Weddings Completed
          </label>
          <input
            id="stats-weddings"
            type="number"
            min="0"
            value={stats.weddings}
            onChange={(e) => handleNumChange("weddings", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors font-mono"
          />
        </div>

        {/* Happy Couples */}
        <div className="space-y-1.5 bg-white/2 border border-white/5 p-4 rounded-lg">
          <label htmlFor="stats-couples" className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gold" /> Happy Couples
          </label>
          <input
            id="stats-couples"
            type="number"
            min="0"
            value={stats.couples}
            onChange={(e) => handleNumChange("couples", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors font-mono"
          />
        </div>

        {/* Major Events */}
        <div className="space-y-1.5 bg-white/2 border border-white/5 p-4 rounded-lg">
          <label htmlFor="stats-events" className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-gold" /> Major Events Shot
          </label>
          <input
            id="stats-events"
            type="number"
            min="0"
            value={stats.events}
            onChange={(e) => handleNumChange("events", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors font-mono"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <h4 className="text-sm font-serif text-gold font-medium">Manifesto &amp; Legacy Background</h4>
        <AdminMediaUpload
          id="stats-bg"
          label="Background Image for 'We don't just take photos, we preserve your legacy' block"
          value={stats.backgroundUrl || ""}
          onChange={(url) => handleUrlChange("backgroundUrl", url)}
          accept="image/*"
        />
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <h4 className="text-sm font-serif text-gold font-medium">Handcrafted Artistry - Polaroid Collage Images</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminMediaUpload
            id="polaroid1"
            label="Polaroid Image 1 (Left tilted, recommended grayscale portrait)"
            value={stats.polaroid1Url || ""}
            onChange={(url) => handleUrlChange("polaroid1Url", url)}
            accept="image/*"
          />
          <AdminMediaUpload
            id="polaroid2"
            label="Polaroid Image 2 (Right tilted, recommended couple landscape/portrait)"
            value={stats.polaroid2Url || ""}
            onChange={(url) => handleUrlChange("polaroid2Url", url)}
            accept="image/*"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <h4 className="text-sm font-serif text-gold font-medium">Handcrafted Artistry - Film Strip Frames</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminMediaUpload
            id="filmFrame1"
            label="Film Strip Frame 1 (Left-most frame)"
            value={stats.filmFrame1Url || ""}
            onChange={(url) => handleUrlChange("filmFrame1Url", url)}
            accept="image/*"
          />
          <AdminMediaUpload
            id="filmFrame2"
            label="Film Strip Frame 2 (Middle frame)"
            value={stats.filmFrame2Url || ""}
            onChange={(url) => handleUrlChange("filmFrame2Url", url)}
            accept="image/*"
          />
          <AdminMediaUpload
            id="filmFrame3"
            label="Film Strip Frame 3 (Right-most frame)"
            value={stats.filmFrame3Url || ""}
            onChange={(url) => handleUrlChange("filmFrame3Url", url)}
            accept="image/*"
          />
        </div>
      </div>
    </form>
  );
};
