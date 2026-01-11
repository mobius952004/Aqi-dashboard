import { AQI_LEVELS } from "../../constants/aqiConfig";

export default function AQILegend() {
  return (
    <div className="flex flex-wrap gap-3 text-sm w-full m-5 ">
      {AQI_LEVELS.map(level => (
        <div
          key={level.label}
          className={`flex items-center gap-9 px-3 py-1 rounded ${level.bg} ${level.text}`}
        >
          <span className="font-semibold">{level.label}</span>
          <span className="opacity-80">
            ({level.min}–{level.max})
          </span>
        </div>
      ))}
    </div>
  );
}
