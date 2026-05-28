import { useState } from "react";
import {
  Searchbar,
  Card,
  Fab,
  Popover,
  List,
  ListItem,
  Link,
} from "konsta/react";
import { Plus } from "lucide-react";
import AddLessonPage from "./AddLessonPage";

const STATUS_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "open" },
  { label: "마감", value: "closed" },
  { label: "취소", value: "cancelled" },
];

const items = [
  { title: "FC Ajax" },
  { title: "FC Arsenal" },
  { title: "FC Athletic" },
  { title: "FC Barcelona" },
  { title: "FC Bayern München" },
  { title: "FC Bordeaux" },
  { title: "FC Borussia Dortmund" },
  { title: "FC Chelsea" },
  { title: "FC Galatasaray" },
  { title: "FC Juventus" },
  { title: "FC Liverpool" },
  { title: "FC Manchester City" },
  { title: "FC Manchester United" },
  { title: "FC Paris Saint-Germain" },
  { title: "FC Real Madrid" },
  { title: "FC Tottenham Hotspur" },
  { title: "FC Valencia" },
  { title: "FC West Ham United" },
];

export default function LessonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState(STATUS_OPTIONS[0]);
  const [statusOptionOpened, setStatusOptionOpened] = useState(false);
  const [addSheetOpened, setAddSheetOpened] = useState(false);

  return (
    <div>
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

      {items.map((el) => (
        <Card key={el.title}>
          <div>{el.title}</div>
        </Card>
      ))}

      <AddLessonPage
        opened={addSheetOpened}
        onClose={() => setAddSheetOpened(false)}
      />

      <Fab
        className="fixed right-safe-4 bottom-safe-19 z-21"
        icon={<Plus />}
        onClick={() => setAddSheetOpened(true)}
      />
    </div>
  );
}
