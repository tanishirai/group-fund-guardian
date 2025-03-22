
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { members } from "@/lib/data";
import { Edit, Save, User } from "lucide-react";

export default function Profile() {
  const { memberId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  // Find the selected member or use first member as default
  const selectedMember = memberId 
    ? members.find(m => m.id === memberId) 
    : members[0];

  if (!selectedMember) {
    return (
      <PageLayout>
        <PageHeader title="Profile Not Found" />
        <Card>
          <CardContent className="pt-6">
            <p>The requested profile could not be found.</p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the logic to save profile changes
    setIsEditing(false);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <PageLayout>
      <PageHeader 
        title="User Profile" 
        description="View and manage your profile information"
      >
        {!isEditing ? (
          <Button onClick={handleToggleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <Button onClick={handleSaveProfile} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Profile Overview Card */}
        <Card className="md:col-span-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/avatars/${selectedMember.id}.jpg`} alt={selectedMember.name} />
                <AvatarFallback className="text-lg">{getInitials(selectedMember.name)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{selectedMember.name}</CardTitle>
            <CardDescription>{selectedMember.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contributed</p>
                <p className="text-2xl font-bold">${selectedMember.contributed.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currently Owed</p>
                <p className="text-2xl font-bold">${selectedMember.owed.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Edit your personal details below" 
                : "View your personal details below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={selectedMember.name} 
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={selectedMember.email} 
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    defaultValue="(555) 123-4567" 
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself"
                    defaultValue="I'm a member of multiple expense sharing groups."
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
                
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <Input id="avatar" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 300x300px. Max file size: 2MB.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleToggleEdit}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
