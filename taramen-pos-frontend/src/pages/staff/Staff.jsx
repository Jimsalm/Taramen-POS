import PosLayout from "@/layout/PosLayout";

import StaffHeader from "@/components/features/staff/StaffHeader";
import StaffCards from "@/components/features/staff/StaffCards";
import StaffTable from "@/components/features/staff/StaffTable";
import StaffPagination from "@/components/features/staff/StaffPagination";

export default function Staff() {


  return (
    <PosLayout>
      <StaffHeader />
      <div className="relative">
      <StaffCards />
      <StaffTable />
      <StaffPagination />
      </div>
    </PosLayout>
  );
}
