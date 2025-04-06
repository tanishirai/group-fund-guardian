
import { useState } from "react";
import { 
  Users, 
  Plus, 
  UserPlus, 
  UserMinus,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { groups, members } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [localGroups, setLocalGroups] = useState(groups);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive"
      });
      return;
    }

    const newGroup = {
      id: `group-${localGroups.length + 1}`,
      name: newGroupName,
      members: ["You"],
      expenses: [],
      balance: 0
    };

    const updatedGroups = [...localGroups, newGroup];
    setLocalGroups(updatedGroups);
    setSelectedGroup(newGroup);
    setCreateDialogOpen(false);
    setNewGroupName("");
    
    toast({
      title: "Success",
      description: `Group "${newGroupName}" created`,
    });
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send an invitation email
    // For now, we'll just show a success message
    setInviteDialogOpen(false);
    setInviteEmail("");
    
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail}`,
    });
  };

  const handleRemoveMember = () => {
    if (!memberToRemove) {
      return;
    }

    // In a real app, this would remove the member from the database
    // For now, we'll just show a success message
    setRemoveDialogOpen(false);
    setMemberToRemove(null);
    
    toast({
      title: "Member removed",
      description: `${memberToRemove} has been removed from ${selectedGroup.name}`,
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Groups & Members" 
        description="Manage your expense sharing groups"
      >
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-button"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Groups List */}
        <Card className="p-6 border shadow-card col-span-1 animate-slide-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Your Groups
          </h3>
          
          <div className="space-y-3">
            {localGroups.map((group) => (
              <div 
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-all duration-200 flex justify-between items-center",
                  selectedGroup.id === group.id 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-secondary hover:bg-primary/10"
                )}
              >
                <div>
                  <div className="font-medium">{group.name}</div>
                  <div className={cn(
                    "text-xs mt-1",
                    selectedGroup.id === group.id ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {group.members.length} members
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "text-sm font-semibold",
                    selectedGroup.id === group.id ? "text-white" : "text-foreground"
                  )}>
                    ${group.balance.toFixed(2)}
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4",
                    selectedGroup.id === group.id ? "text-white" : "text-muted-foreground"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Group Details */}
        <Card className="p-6 border shadow-card col-span-1 lg:col-span-2 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
              <p className="text-muted-foreground">{selectedGroup.members.length} members • ${selectedGroup.balance.toFixed(2)} total</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1" /> Invite
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setRemoveDialogOpen(true)}>
                <UserMinus className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
          </div>

          {/* Group Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-xl font-semibold mt-1">${selectedGroup.balance.toFixed(2)}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-xl font-semibold mt-1">{selectedGroup.expenses.length}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Average per Person</p>
              <p className="text-xl font-semibold mt-1">
                ${selectedGroup.members.length > 0 ? (selectedGroup.balance / selectedGroup.members.length).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>

          {/* Members Table */}
          <h3 className="text-lg font-semibold mb-3">Members</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contributed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Owed
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Net Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {members.filter(member => 
                  selectedGroup.members.includes(member.name)
                ).map((member) => {
                  const netBalance = member.contributed - member.owed;
                  return (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${member.contributed.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${member.owed.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={cn(
                          "font-medium",
                          netBalance > 0 ? "text-positive" : netBalance < 0 ? "text-negative" : ""
                        )}>
                          {netBalance > 0 ? "+" : ""}{netBalance.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Enter a name for your new expense sharing group.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you'd like to invite to "{selectedGroup.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Email Address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInviteMember}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Select a member to remove from "{selectedGroup.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {members.filter(member => 
              selectedGroup.members.includes(member.name)
            ).map(member => (
              <div 
                key={member.id}
                onClick={() => setMemberToRemove(member.name)}
                className={cn(
                  "p-3 rounded-md border cursor-pointer flex items-center",
                  memberToRemove === member.name ? "border-primary bg-primary/10" : "border-input"
                )}
              >
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveMember} disabled={!memberToRemove}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Groups;

