import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function MemberList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");

  // Fetch groups and members
  useEffect(() => {
    const fetchGroupsAndMembers = async () => {
      try {
        const groupsSnapshot = await getDocs(collection(db, "groups"));
        const groupsData = groupsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupsData);

        const membersSnapshot = await getDocs(collection(db, "members"));
        const membersData = membersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGroupsAndMembers();
  }, []);

  const clearInputs = () => {
    setSelectedGroup("");
    setUsernameInput("");
  };

  const handleInviteMember = async () => {
    if (!selectedGroup || !usernameInput.trim()) {
      toast({
        title: "Error",
        description: "Please select a group and enter a username.",
        variant: "destructive",
      });
      clearInputs();
      return;
    }

    try {
      const memberSnapshot = await getDocs(
        query(collection(db, "members"), where("username", "==", usernameInput.trim()))
      );

      const memberDoc = memberSnapshot.docs[0];

      if (!memberDoc) {
        toast({
          title: "Error",
          description: "No member found with that username.",
          variant: "destructive",
        });
        clearInputs();
        return;
      }

      const memberId = memberDoc.id;
      const groupRef = doc(db, "groups", selectedGroup);
      const groupData = groups.find((group) => group.id === selectedGroup);

      if (groupData?.members?.includes(memberId)) {
        toast({
          title: "Already Added",
          description: "This member is already part of the group.",
        });
      } else {
        await updateDoc(groupRef, {
          members: arrayUnion(memberId),
        });

        toast({
          title: "Success",
          description: `${usernameInput} has been invited to the group.`,
        });
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to invite member.",
        variant: "destructive",
      });
    } finally {
      clearInputs();
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedGroup || !usernameInput.trim()) {
      toast({
        title: "Error",
        description: "Please select a group and enter a username.",
        variant: "destructive",
      });
      clearInputs();
      return;
    }

    try {
      const memberSnapshot = await getDocs(
        query(collection(db, "members"), where("username", "==", usernameInput.trim()))
      );

      const memberDoc = memberSnapshot.docs[0];

      if (!memberDoc) {
        toast({
          title: "Error",
          description: "No member found with that username.",
          variant: "destructive",
        });
        clearInputs();
        return;
      }

      const memberId = memberDoc.id;
      const groupData = groups.find((group) => group.id === selectedGroup);

      if (!groupData?.members?.includes(memberId)) {
        toast({
          title: "Error",
          description: "This member is not in the selected group.",
          variant: "destructive",
        });
        clearInputs();
        return;
      }

      const groupRef = doc(db, "groups", selectedGroup);
      await updateDoc(groupRef, {
        members: arrayRemove(memberId),
      });

      toast({
        title: "Success",
        description: "Member removed from group.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove member.",
        variant: "destructive",
      });
    } finally {
      clearInputs();
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!selectedGroup) return matchSearch;

    const group = groups.find((g) => g.id === selectedGroup);
    return matchSearch && group?.members?.includes(member.id);
  });

  return (
    <div className="space-y-6">
      {/* Invite/Remove Member Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Manage Group Members</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="group" className="block text-sm font-medium mb-1">
              Select Group
            </label>
            <select
              id="group"
              className="w-full border rounded-md px-3 py-2"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              placeholder="Enter username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleInviteMember}>Invite Member</Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove Member
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3">
          <Input
            type="search"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Contributed</TableHead>
              <TableHead className="text-right">Owed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No members found. Try a different search.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="text-right">
                    ₹{member.contributed?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{member.owed?.toFixed(2) || "0.00"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
