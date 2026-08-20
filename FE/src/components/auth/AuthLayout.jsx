export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative h-full w-full flex rows justify-center-safe items-center bg-[url(/bg_ocean.png)] bg-cover bg-center">
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="relative w-full flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1 rounded-xl text-white px-6 py-3 text-2xl font-bold">
          DiveBook
        </div>
        <div className="w-85 flex flex-col gap-5 py-6 px-5 rounded-2xl bg-gray-100">
          <div>
            <div className="font-extrabold text-3xl">{title}</div>
            <div className="font-medium text-gray-500">{subtitle}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
