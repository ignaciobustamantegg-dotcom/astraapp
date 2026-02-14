import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const AudioPlayer = ({ src, title }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play();
    }
    setPlaying(!playing);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-card-glass border-glass rounded-xl px-4 py-3 flex items-center gap-3">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 hover:bg-primary/30 transition-colors"
      >
        {playing ? (
          <Pause className="w-4 h-4 text-primary" />
        ) : (
          <Play className="w-4 h-4 text-primary ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-foreground text-xs font-medium truncate mb-1">{title}</p>
        )}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60 transition-all"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>
      </div>
      <span className="text-muted-foreground text-[10px] flex-shrink-0">
        {duration ? fmt(duration - progress) : "0:00"}
      </span>
    </div>
  );
};

export default AudioPlayer;
