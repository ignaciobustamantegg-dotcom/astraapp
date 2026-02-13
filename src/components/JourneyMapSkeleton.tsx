import { motion } from "framer-motion";

const NODE_POSITIONS = [50, 30, 70, 40, 65, 35, 50];

const generatePath = () => {
  const nodeSpacing = 160;
  const topOffset = 40;
  const points = NODE_POSITIONS.map((x, i) => ({
    x: (x / 100) * 380,
    y: topOffset + i * nodeSpacing,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midY = (curr.y + next.y) / 2;
    d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
  }
  return { d, points, totalHeight: topOffset + (points.length - 1) * nodeSpacing + 80 };
};

const JourneyMapSkeleton = () => {
  const { d: pathD, points, totalHeight } = generatePath();

  return (
    <>
      <div className="px-5 pt-5 pb-2 text-center">
        <div className="h-3 w-32 mx-auto mb-2 rounded bg-muted/30 animate-pulse" />
        <div className="h-6 w-48 mx-auto rounded bg-muted/20 animate-pulse" />
      </div>

      <div className="relative px-3" style={{ height: totalHeight }}>
        <svg
          className="absolute inset-0 w-full"
          style={{ height: totalHeight }}
          viewBox={`0 0 400 ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          <path
            d={pathD}
            stroke="hsl(260, 30%, 20%)"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {points.map((point, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: `${(point.x / 400) * 100}%`,
              top: point.y,
              transform: 'translate(-50%, -50%)',
              width: 140,
            }}
          >
            <div className="h-2.5 w-10 mb-2 rounded bg-muted/20 animate-pulse" />
            <div
              className="w-[72px] h-[72px] rounded-full animate-pulse"
              style={{ background: 'hsl(260, 25%, 14%)' }}
            />
            <div className="h-3 w-20 mt-2.5 rounded bg-muted/20 animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
};

export default JourneyMapSkeleton;
