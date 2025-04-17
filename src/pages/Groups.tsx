import { useState, useEffect } from "react"
import { Users, Plus, UserPlus, UserMinus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/PageHeader"
import PageLayout from "@/components/layout/PageLayout"
import { cn } from "@/lib/utils"
import {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "@/firebase"
import { toast } from "@/hooks/use-toast"

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [joinGroupCode, setJoinGroupCode] = useState("")

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsSnapshot = await getDocs(collection(db, "groups"))
        const groupsList = groupsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setGroups(groupsList)
        if (groupsList.length > 0) {
          setSelectedGroup(groupsList[0])
          setInviteCode(groupsList[0].inviteCode || "")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch groups",
          variant: "destructive",
        })
      }
    }
    fetchGroups()
  }, [])

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      })
      return
    }
    const code = generateInviteCode()
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: newGroupName,
        members: ["You"],
        expenses: [],
        balance: 0,
        inviteCode: code,
      })
      const newGroup = {
        id: docRef.id,
        name: newGroupName,
        members: ["You"],
        expenses: [],
        balance: 0,
        inviteCode: code,
      }
      setGroups((prev) => [...prev, newGroup])
      setSelectedGroup(newGroup)
      setInviteCode(code)
      toast({
        title: "Success",
        description: `Group '${newGroupName}' created`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return
    try {
      await deleteDoc(doc(db, "groups", selectedGroup.id))
      const updatedGroups = groups.filter((g) => g.id !== selectedGroup.id)
      setGroups(updatedGroups)
      setSelectedGroup(updatedGroups[0] || null)
      toast({
        title: "Group deleted",
        description: `${selectedGroup.name} was deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete group",
        variant: "destructive",
      })
    }
  }

  const handleJoinGroup = async () => {
    if (!joinGroupCode.trim()) {
      toast({ title: "Error", description: "Please enter an invite code", variant: "destructive" })
      return
    }
  
    try {
      const snapshot = await getDocs(collection(db, "groups"))
      const matchedDoc = snapshot.docs.find((doc) => doc.data().inviteCode === joinGroupCode)
  
      if (!matchedDoc) {
        toast({ title: "Error", description: "Invalid invite code", variant: "destructive" })
        return
      }
  
      const groupRef = doc(db, "groups", matchedDoc.id)
      const groupData = matchedDoc.data()
      const members = groupData.members || []
  
      if (members.includes("You")) {
        toast({
          title: "Already a Member",
          description: "You are already a member of this group",
          variant: "default",
        })
        setJoinGroupCode("") // Clear input
        return
      }
  
      const updatedMembers = [...members, "You"]
      await updateDoc(groupRef, { members: updatedMembers })
  
      const updatedGroup = { id: matchedDoc.id, ...groupData, members: updatedMembers }
      const updatedGroups = [...groups, updatedGroup]
      setGroups(updatedGroups)
      setSelectedGroup(updatedGroup)
      setJoinGroupCode("") // Clear input after successful join
  
      toast({ title: "Success", description: `Joined ${updatedGroup.name}` })
    } catch (error) {
      toast({ title: "Error", description: "Could not join group", variant: "destructive" })
    }
  }
  

  const generateInviteCode = () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()

  return (
    <PageLayout>
      <PageHeader
        title="Groups & Members"
        description="Manage your groups and invitations"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <Button onClick={handleCreateGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-3">Your Groups</h2>
          {groups.map((group) => (
            <div
              key={group.id}
              className={cn(
                "p-3 rounded border cursor-pointer mb-2",
                selectedGroup?.id === group.id
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              )}
              onClick={() => {
                setSelectedGroup(group)
                setInviteCode(group.inviteCode || "")
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-xs">{group.members.length} members</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-6 lg:col-span-2">
          {selectedGroup ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Invite Code: {inviteCode}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(inviteCode)}
                  >
                    Copy Invite
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteGroup}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary p-4 rounded">
                  <p className="text-muted-foreground text-sm">Balance</p>
                  <p className="text-xl font-semibold">
                    ₹{selectedGroup.balance.toFixed(2)}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded">
                  <p className="text-muted-foreground text-sm">Expenses</p>
                  <p className="text-xl font-semibold">
                    {selectedGroup.expenses.length}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded">
                  <p className="text-muted-foreground text-sm">Members</p>
                  <p className="text-xl font-semibold">
                    {selectedGroup.members.length}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Group Members</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedGroup.members.map((member, idx) => (
                    <li key={idx}>{member}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  value={joinGroupCode}
                  onChange={(e) => setJoinGroupCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="border px-3 py-2 rounded w-full"
                />
                <Button onClick={handleJoinGroup}>Join Group</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select a group to see details.
            </p>
          )}
        </Card>
      </div>
    </PageLayout>
  )
}

export default Groups
