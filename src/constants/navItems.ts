import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Users,
  Settings,
} from "lucide-react";

const allNavItems = {
  dashboard: {
    id: "Dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
    href: "/",
  },
  lesson: {
    id: "Lesson",
    label: "강습",
    icon: CalendarDays,
    href: "/Lesson",
  },
  student: {
    id: "Student",
    label: "수강생",
    icon: Users,
    href: "/Student",
  },
  crew: {
    id: "Crew",
    label: "크루",
    icon: Building2,
    href: "/Crew",
  },
  instructor: {
    id: "Instructor",
    label: "강사",
    icon: Settings,
    href: "/Instructor",
  },
};

export const bottomNavItems = [
  allNavItems.dashboard,
  allNavItems.lesson,
  allNavItems.student,
  allNavItems.crew,
  allNavItems.instructor,
];
