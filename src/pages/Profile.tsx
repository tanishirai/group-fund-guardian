import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { Edit, User, Mail, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { members, groups, transactions, debts } from "@/lib/data";
import { TransactionCard } from "@/components/ui/TransactionCard";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const Profile = () => {
  const { memberId } = useParams();
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [selectedMember, setSelectedMember] = useState(members[0]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const { toast } = useToast();

  // Initialize form with selected member data
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: selectedMember.name,
      email: selectedMember.email,
    },
  });

  useEffect(() => {
    if (memberId) {
      const member = members.find((m) => m.id === memberId);
      if (member) {
        setSelectedMember(member);
        setIsCurrentUser(false);
        form.reset({
          name: member.name,
          email: member.email,
        });
      }
    } else {
      setSelectedMember(members[0]); // Default to first member when no ID
      setIsCurrentUser(true);
      form.reset({
        name: members[0].name,
        email: members[0].email,
      });
    }
  }, [memberId, form]);

  // Get member's transactions
  const memberTransactions = transactions.filter(
    (transaction) => transaction.paidBy === selectedMember.name
  ).slice(0, 3);

  // Get member's groups
  const memberGroups = groups.filter(
    (group) => group.members.includes(selectedMember.name)
  );

  // Get member's debts (both owed and owing)
  const memberDebts = debts.filter(
    (debt) => debt.from === selectedMember.name || debt.to === selectedMember.name
  );

  const handleEditSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // In a real app, this would update the database
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };

  const handleRemoveMember = () => {
    // In a real app, this would remove the member from the group
    toast({
      title: "Member removed",
      description: `${memberToRemove?.name} has been removed from the group.`,
    });
    setIsRemoveDialogOpen(false);
  };

  const netBalance = selectedMember.contributed - selectedMember.owed;

  return (
    <PageLayout>
      <PageHeader
        title={isCurrentUser ? "My Profile" : selectedMember.name}
        description={isCurrentUser ? "Manage your personal information and track your expenses" : "View member details and activity"}
      >
        {isCurrentUser && (
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border shadow-card animate-fade-in">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-start">
              <CardTitle>Profile Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="text-4xl font-semibold">{selectedMember.name.charAt(0)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedMember.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Groups</p>
                  <p className="font-medium">{memberGroups.length} groups</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className={cn(
                    "font-medium",
                    netBalance > 0 ? "text-green-600" :
                    netBalance < 0 ? "text-red-600" : ""
                  )}>
                    {netBalance > 0 ? "+" : ""}{netBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary & Activity */}
        <Card className="lg:col-span-2 border shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Contributed</p>
                <p className="text-xl font-semibold mt-1">₹{selectedMember.contributed.toFixed(2)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Owed</p>
                <p className="text-xl font-semibold mt-1">₹{selectedMember.owed.toFixed(2)}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={cn(
                  "text-xl font-semibold mt-1",
                  netBalance > 0 ? "text-green-600" :
                  netBalance < 0 ? "text-red-600" : ""
                )}>
                  {netBalance > 0 ? "+" : ""}₹{Math.abs(netBalance).toFixed(2)}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {memberTransactions.length > 0 ? (
              <div className="space-y-4 mb-8">
                {memberTransactions.map(transaction => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction} 
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent transactions</p>
            )}

            <h3 className="text-lg font-semibold mb-4">Active Settlements</h3>
            {memberDebts.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        With
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border">
                    {memberDebts.map(debt => {
                      const isOwing = debt.from === selectedMember.name;
                      return (
                        <tr key={debt.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-block px-2 py-1 text-xs rounded-full",
                              isOwing ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            )}>
                              {isOwing ? "Owing" : "Owed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">
                              {isOwing ? debt.to : debt.from}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">
                              {debt.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={cn(
                              "font-semibold",
                              isOwing ? "text-red-600" : "text-green-600"
                            )}>
                              {isOwing ? "-" : "+"}₹{debt.amount.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No active settlements</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleRemoveMember}>Remove Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Profile;
