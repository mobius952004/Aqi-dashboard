export default function Pagination({ page, total, onChange }) {
  const MAX_VISIBLE = 10

  let start = Math.max(1, page - 2)
  let end = Math.min(total, start + MAX_VISIBLE - 1)

  if (end - start < MAX_VISIBLE - 1) {
    start = Math.max(1, end - MAX_VISIBLE + 1)
  }

  const pages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )

  return (
    <div className="flex items-center gap-2">
      
      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-2 rounded ${
            p === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
