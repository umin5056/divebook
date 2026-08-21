import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLessons } from "../hooks/useLessons";
import { Fab, Popover, List, ListItem, Link } from "konsta/react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import LessonCard from "../components/lesson/LessonCard";

const STATUS_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "모집", value: "open" },
  { label: "마감", value: "closed" },
  { label: "취소", value: "cancelled" },
];

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"];

export default function LessonPage() {
  const navigate = useNavigate();
  const [statusOption, setStatusOption] = useState(STATUS_OPTIONS[0]);
  const [statusOptionOpened, setStatusOptionOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const { data: lessons = [] } = useLessons();

  const dates = [
    ...new Set(
      lessons
        .map((lesson) => lesson.lessonDate)
        .filter((date) => date.startsWith(month)),
    ),
  ].sort();

  const selectedDateRef = useRef(null);

  useEffect(() => {
    selectedDateRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [dates]);

  const handleChangeMonth = (diff) => {
    const [year, m] = month.split("-").map(Number);
    const next = new Date(year, m - 1 + diff, 1);
    setMonth(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
    );
    setSelectedDate(null);
  };

  const filteredLessons = lessons?.filter(
    (lesson) =>
      (statusOption.value === "all" || lesson.status === statusOption.value) &&
      (!selectedDate || lesson.lessonDate === selectedDate),
  );

  return (
    <div className="flex flex-col gap-4  px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-4 shrink-0">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() => handleChangeMonth(-1)}
          />
          <div className="font-bold">
            {month.split("-")[0]}년 {month.split("-")[1].padStart(2, "0")}월
          </div>
          <ChevronRight
            className="cursor-pointer"
            onClick={() => handleChangeMonth(1)}
          />
        </div>
        <div className="bg-ios-light-glass shadow-ios-light-glass dark:bg-ios-dark-glass dark:shadow-ios-dark-glass rounded-full p-2 w-20 text-center font-bold">
          <Link
            className="popover-status-option text-gray-950"
            onClick={() => setStatusOptionOpened(true)}
          >
            {statusOption.label}
          </Link>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pt-2 shrink-0">
        {dates.length === 0 ? (
          <div className="flex-1 text-center font-bold text-gray-500">
            조회된 날짜가 없습니다.
          </div>
        ) : (
          dates.map((date) => {
            const isSelected = date === selectedDate;
            const day = new Date(date).getDay();

            return (
              <div
                key={date}
                ref={isSelected ? selectedDateRef : null}
                onClick={() => setSelectedDate(isSelected ? null : date)}
                className={`flex shrink-0 flex-col items-center gap-1 py-2 rounded-2xl transition-transform duration-300 ${
                  isSelected
                    ? "-translate-y-2 text-white font-bold bg-[#008080]"
                    : "text-gray-400"
                }`}
                style={{ width: `${100 / 7}%` }}
              >
                <div className="">{WEEKDAY_LABEL[day]}</div>
                <div className="text-lg">{Number(date.slice(-2))}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-2">
        {filteredLessons.length === 0 ? (
          <div className="text-center font-bold text-2xl text-gray-500">
            조회된 결과가 없습니다.
          </div>
        ) : (
          filteredLessons?.map((lesson) => (
            <div
              key={lesson.lessonId}
              onClick={() => navigate(`/lesson/${lesson.lessonId}`)}
            >
              <LessonCard {...lesson} />
            </div>
          ))
        )}
      </div>

      <Fab
        className="fixed right-8 bottom-20 z-21 bg-[#008080]"
        icon={<Plus />}
        onClick={() => navigate("/lesson/new")}
      />

      <Popover
        opened={statusOptionOpened}
        target=".popover-status-option"
        onBackdropClick={() => setStatusOptionOpened(false)}
      >
        <List nested>
          {STATUS_OPTIONS.map((option) => (
            <ListItem
              key={option.value}
              title={option.label}
              onClick={() => {
                setStatusOption(option);
                setStatusOptionOpened(false);
              }}
            />
          ))}
        </List>
      </Popover>
    </div>
  );
}
