export default function Pagination({ page, total, onChange }) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-4 py-2 rounded ${
            page === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
