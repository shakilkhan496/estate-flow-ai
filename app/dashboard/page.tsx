import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  return <DashboardContent user={user} />;
}
