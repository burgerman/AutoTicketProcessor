
'use client';

import { getLatestAnalyticsReports } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { AnalyticsReport } from "@/lib/types";

export default function History() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      const result = await getLatestAnalyticsReports();
      if ('error' in result) {
        setError(result.error);
      } else {
        setReports(result);
      }
    }

    fetchReports();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Causes</TableHead>
                <TableHead>Quick Fixes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.report_id}>
                  <TableCell>{report.report_id}</TableCell>
                  <TableCell>{report.report_summary}</TableCell>
                  <TableCell>{new Date(report.created_time).toLocaleDateString()}</TableCell>
                  <TableCell>{report.identified_issues}</TableCell>
                  <TableCell>{report.common_causes}</TableCell>
                   <TableCell>{report.quick_fixes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
