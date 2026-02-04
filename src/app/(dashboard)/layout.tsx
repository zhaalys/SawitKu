import DashboardLayout from "@/components/layout/dashboard-layout";

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
