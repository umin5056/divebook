import { FaSquarePhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { BsChatLeftTextFill } from "react-icons/bs";

export default function StudentCard({ student, onClick, children }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <div onClick={handleClick}>
      <div className=" bg-white border border-gray-400 rounded-xl p-4 ">
        <div className="min-w-0 wrap-break-words">
          <span className="text-2xl font-semibold text-gray-900 ">
            {student.name}
          </span>
        </div>
        <div className="flex gap-2 text-base text-gray-500">
          <FaSquarePhone className="mt-1 shrink-0" />
          <span className="min-w-0 wrap-break-words">{student.phone}</span>
        </div>
        <div className="flex gap-2 text-base text-gray-500">
          <IoIosMail className="mt-1 shrink-0" />
          <span className="min-w-0 wrap-break-words">{student.email}</span>
        </div>
        <div className="flex gap-2 text-base text-gray-500">
          <BsChatLeftTextFill className="mt-1 shrink-0" />
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {student.content}
          </span>
        </div>
        {children && children}
      </div>
    </div>
  );
}
