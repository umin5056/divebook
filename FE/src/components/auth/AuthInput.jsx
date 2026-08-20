export default function AuthInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
      <input
        {...props}
        className="w-full rounded-lg bg-white border border-gray-300 pl-9 pr-3 py-2 outline-none"
      />
    </div>
  );
}
