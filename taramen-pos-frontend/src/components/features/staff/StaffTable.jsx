import ISelect from "@/components/custom/Select";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { useState } from "react";
import Title from "@/components/custom/Title";
import Button from "@/components/custom/Button";

export default function StaffTable() {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample staff data
  const staffData = [
    {
      id: 1,
      name: "John Doe",
      role: "Head Chef",
      email: "johndoe@gmail.com",
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Head Chef", 
      email: "janesmith@gmail.com",
      status: "active"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Head Chef",
      email: "mikejohnson@gmail.com", 
      status: "on-leave"
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Head Chef",
      email: "sarahw@gmail.com",
      status: "active"
    },
    {
      id: 5,
      name: "Tom Brown",
      role: "Head Chef",
      email: "tombrown@gmail.com",
      status: "active"
    },
    {
      id: 6,
      name: "Emily Davis",
      role: "Head Chef", 
      email: "emilyd@gmail.com",
      status: "active"
    }
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "head-chef", label: "Head Chef" },
    { value: "assistant-chef", label: "Assistant Chef" },
    { value: "sushi-chef", label: "Sushi Chef" },
    { value: "waitress", label: "Waitress" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on-leave", label: "On Leave" },
  ];

  // Filter staff data based on selected role and status
  const filteredStaff = staffData.filter(staff => {
    const roleMatch = selectedRole === "all" || staff.role.toLowerCase().replace(" ", "-") === selectedRole;
    const statusMatch = selectedStatus === "all" || staff.status === selectedStatus;
    return roleMatch && statusMatch;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return "inline-flex items-center rounded-xl bg-green-200 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20";
      case "on-leave":
        return "inline-flex items-center rounded-xl bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20";
      case "inactive":
        return "inline-flex items-center rounded-xl bg-red-200 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20";
      default:
        return "inline-flex items-center rounded-xl bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20";
    }
  };

  // Format status text
  const formatStatus = (status) => {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const selectTriggerClass = "h-10 w-48 rounded-lg border-gray-200 bg-primary px-3 text-sm font-normal text-white [&_svg]:!text-white [&_svg]:!opacity-100";
  const selectContentClass = "[&_svg]:!text-white [&_svg]:!opacity-100";

  return (
    <div className="rounded-2xl p-6 text-sm text-gray-500 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Title size="2xl" className="text-gray-900">Employee Directory</Title>
        <div className="flex gap-3">
          <ISelect
            useForm={false}
            showAll={false}
            value={selectedRole}
            options={roleOptions}
            onValueChange={(option) => setSelectedRole(option?.value ?? "all")}
            className="w-48"
            triggerClassName={selectTriggerClass}
            contentClassName={selectContentClass}
          />
          <ISelect
            useForm={false}
            showAll={false}
            value={selectedStatus}
            options={statusOptions}
            onValueChange={(option) => setSelectedStatus(option?.value ?? "all")}
            className="w-48"
            triggerClassName={selectTriggerClass}
            contentClassName={selectContentClass}
          />
        </div>
      </div>
      <Table className="border border-gray-100 rounded-md mt-4 text-center overflow-hidden">
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-primary-foreground text-center">Name</TableHead>
            <TableHead className="text-primary-foreground text-center">Role</TableHead>
            <TableHead className="text-primary-foreground text-center">Contact Info</TableHead>
            <TableHead className="text-primary-foreground text-center">Status</TableHead>
            <TableHead className="text-primary-foreground text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((staff, index) => (
            <TableRow key={staff.id} className={index % 2 === 1 ? "bg-gray-200" : ""}>
              <TableCell>{staff.name}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>
                <span className={getStatusBadge(staff.status)}>
                  {formatStatus(staff.status)}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <i className="fa-solid fa-pencil text-gray-600 cursor-pointer"></i>
                <i className="fa-solid fa-ellipsis-vertical text-gray-600 cursor-pointer"></i>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}