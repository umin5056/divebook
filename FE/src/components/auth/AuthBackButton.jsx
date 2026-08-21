export default function AuthBackButton({ visible, onClick }) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className="w-full border rounded-lg py-1 font-bold text-gray-500"
      onClick={onClick}
    >
      이전
    </button>
  );
}
