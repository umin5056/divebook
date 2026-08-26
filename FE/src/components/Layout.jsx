import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toolbar, ToolbarPane, Navbar, Page, Panel } from "konsta/react";
import { MdPayments, MdWatchLater } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import BottomNav from "./BottomNav";
import { FaBell } from "react-icons/fa";
import { X } from "lucide-react";
import { useLessonApproval } from "../hooks/useLessonApproval";

export function Layout() {
  const navigate = useNavigate();
  const [approvalOpened, setApprovalOpened] = useState(false);
  const { data: approvals = [] } = useLessonApproval();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="h-full flex flex-col justify-between">
      <Navbar
        title="DiveBook"
        subtitle=""
        className="top-0 sticky py-1"
        right={
          <div
            className="relative mx-3"
            onClick={() => setApprovalOpened(true)}
          >
            <FaBell size={25} />
            {approvals.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none font-bold">
                {approvals.length}
              </span>
            )}
          </div>
        }
      />
      <Page className="py-15 flex-1 overflow-y-auto">
        <Outlet />
      </Page>
      <BottomNav />

      <ApprovalPanel
        approvals={approvals}
        opened={approvalOpened}
        onClose={() => setApprovalOpened(false)}
      />
    </div>
  );
}

function ApprovalPanel({ approvals, opened, onClose }) {
  const navigate = useNavigate();

  const handleMoveToApproval = (lessonId) => {
    onClose();
    navigate(`/lesson/${lessonId}`, { state: { activeTab: "students" } });
  };

  return (
    <Panel
      side="right"
      opened={opened}
      onBackdropClick={onClose}
      className="w-full"
    >
      <div className="h-full flex flex-col justify-between">
        <Toolbar top className="bg-gray-100 justify-center items-center p-4">
          <div className="flex items-center text-2xl font-semibold">
            입금 확인 신청 ({approvals.length})
          </div>
          <ToolbarPane className="p-3">
            <X onClick={onClose} />
          </ToolbarPane>
        </Toolbar>
        <Page className="pt-20 overflow-y-auto bg-gray-100">
          {approvals.length === 0 && (
            <div className="text-center">조회된 결과가 없습니다.</div>
          )}
          {approvals.map((a) => (
            <div
              key={a.enrollmentId}
              className="flex gap-3 px-3 py-2"
              onClick={() => handleMoveToApproval(a.lessonId)}
            >
              <div>
                <div className="rounded-full bg-blue-600 p-2">
                  <MdPayments size={25} className="text-white" />
                </div>
              </div>
              <div>
                <div>
                  <span className="text-[#008080] font-bold text-xl">
                    {a.name}
                  </span>
                  님이{" "}
                  <span className="text-[#008080] font-bold text-xl">
                    {a.fee.toLocaleString()}
                  </span>
                  원 입금하셨습니다.
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaMapLocationDot />
                  {a.lessonLocation}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MdWatchLater />
                  <div>
                    <div>{a.lessonDate}</div>
                    <div>
                      {a.lessonStartTime} - {a.lessonEndTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Page>
      </div>
    </Panel>
  );
}
