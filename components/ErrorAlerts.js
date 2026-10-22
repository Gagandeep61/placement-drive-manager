export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
