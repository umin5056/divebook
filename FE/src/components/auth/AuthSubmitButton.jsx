export default function AuthSubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-[#008080] py-2 font-bold text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}
