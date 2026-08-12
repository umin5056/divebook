export default function FormRow({ label, children }) {
  return (
    <div className="flex items-center py-4">
      <span className="w-20 shrink-0 text-l text-gray-500">{label}</span>
      {children}
    </div>
  );
}
