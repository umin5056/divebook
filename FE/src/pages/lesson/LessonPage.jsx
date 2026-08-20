import { useState } from "react";
import { useLessons } from "../../hooks/useLessons";
import { Searchbar, Fab, Popover, List, ListItem, Link } from "konsta/react";
import { Plus } from "lucide-react";
import LessonAddSheet from "../../components/lesson/LessonAddSheet";
import LessonDetailSheet from "../../components/lesson/LessonDetailSheet";
import LessonCard from "../../components/lesson/LessonCard";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";
import { lessonToUpdateRequest } from "../../api/lesson";

const STATUS_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "open" },
  { label: "마감", value: "closed" },
  { label: "취소", value: "cancelled" },
];

export default function LessonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState(STATUS_OPTIONS[0]);
  const [statusOptionOpened, setStatusOptionOpened] = useState(false);
  const [addSheetOpened, setAddSheetOpened] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const updateLesson = useUpdateLesson();
  const { data: lessons } = useLessons();

  const filteredLessons = lessons?.filter(
    (lesson) =>
      (statusOption.value === "all" || lesson.status === statusOption.value) &&
      (lesson.title.includes(searchQuery) ||
        lesson.location.includes(searchQuery)),
  );

  const handleCancel = (lesson) => {
    updateLesson.mutate({
      lessonId: lesson.lessonId,
      data: lessonToUpdateRequest(lesson, "cancelled"),
    });
  };

  return (
    <div className="relative">
      <div className="flex gap-2 px-4">
        <Searchbar
          onInput={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onClear={() => setSearchQuery("")}
        />
        <div className="bg-ios-light-glass shadow-ios-light-glass dark:bg-ios-dark-glass dark:shadow-ios-dark-glass rounded-full p-2 w-20 text-center font-bold">
          <Link
            className="popover-status-option text-gray-950"
            onClick={() => setStatusOptionOpened(true)}
          >
            {statusOption.label}
          </Link>
        </div>
      </div>

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

      {filteredLessons?.map((lesson) => (
        <LessonCard
          key={lesson.lessonId}
          lesson={lesson}
          onCancel={handleCancel}
          onPress={setSelectedLesson}
        />
      ))}

      <LessonAddSheet
        opened={addSheetOpened}
        onClose={() => setAddSheetOpened(false)}
      />

      <LessonDetailSheet
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />

      <Fab
        className="fixed right-8 bottom-20 z-21 bg-[#008080]"
        icon={<Plus />}
        onClick={() => setAddSheetOpened(true)}
      />
    </div>
  );
}
