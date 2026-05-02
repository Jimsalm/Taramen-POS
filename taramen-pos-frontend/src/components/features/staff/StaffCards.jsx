import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffCards() {
  return (
    <div className="flex gap-4">
        <Card className="h-24 flex-1">
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            12
          </CardContent>
        </Card>
        <Card className="h-24 flex-1">
          <CardHeader>
            <CardTitle>On Shift Today</CardTitle>
          </CardHeader>
          <CardContent>
            12
          </CardContent>
        </Card>
        <Card className="h-24 flex-1">
          <CardHeader>
            <CardTitle>Upcoming Leave</CardTitle>
          </CardHeader>
          <CardContent>
            12
          </CardContent>
        </Card>
        <Card className="h-24 flex-1">
          <CardHeader>
            <CardTitle>Total Chef</CardTitle>
          </CardHeader>
          <CardContent>
            3
          </CardContent>
        </Card>
        </div>
  );
}