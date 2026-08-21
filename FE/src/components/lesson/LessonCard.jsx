import { MdWatchLater } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import ProgressBar from "../ProgressBar";

const STATUS_LABEL = {
  open: { label: "모집", color: "bg-blue-500" },
  closed: { label: "마감", color: "bg-red-500" },
  cancelled: { label: "취소", color: "bg-gray-400" },
};

export default function LessonCard({ ...props }) {
  return (
    <div className="w-full shrink-0 p-3 rounded-xl border border-gray-400 bg-white snap-center">
      <div className="flex justify-between mb-2">
        <div
          className={`${STATUS_LABEL[props.status].color} rounded-xl px-2 py-1 text-white text-xs`}
        >
          {STATUS_LABEL[props.status].label}
        </div>
        <div className="flex gap-3 items-center text-gray-500 font-bold">
          {props.lessonDate}
        </div>
      </div>
      <div className="flex flex-col gap-1 font-bold ">
        <div className="text-xl">{props.title}</div>
        <div className="flex items-center gap-2 text-gray-500">
          <MdWatchLater />
          {`${props.startTime} - ${props.endTime}`}
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FaMapLocationDot />
          {props.location}
        </div>
      </div>
      <ProgressBar
        current={props.enrollmentCount}
        max={props.maxStudents}
        unit="명"
      />
    </div>
  );
}
