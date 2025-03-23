
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { MemberList } from "@/components/members/MemberList";

export default function Members() {
  return (
    <PageLayout>
      <PageHeader 
        title="Members" 
        description="View and manage all members across your groups."
      />
      <MemberList />
    </PageLayout>
  );
}
