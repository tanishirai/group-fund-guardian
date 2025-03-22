
import { useState } from "react";
import { 
  Bell, 
  Settings,
  ArrowRightLeft,
  Wallet,
  AlertTriangle,
  UserPlus,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { notifications } from "@/lib/data";
import PageLayout from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    expenses: true,
    settlements: true,
    budget: true,
    groups: true
  });

  const markAsRead = (id: string) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications([...readNotifications, id]);
    }
  };

  const markAllAsRead = () => {
    setReadNotifications(notifications.map(n => n.id));
  };

  const toggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Helper function to get icon by notification type
  const getNotificationIcon = (title: string) => {
    if (title.includes("expense")) return <Wallet className="h-5 w-5" />;
    if (title.includes("settlement")) return <ArrowRightLeft className="h-5 w-5" />;
    if (title.includes("budget")) return <AlertTriangle className="h-5 w-5" />;
    if (title.includes("member")) return <UserPlus className="h-5 w-5" />;
    return <Bell className="h-5 w-5" />;
  };

  const notificationsWithRead = notifications.map(notification => ({
    ...notification,
    isRead: readNotifications.includes(notification.id) || notification.read
  }));

  const unreadCount = notificationsWithRead.filter(n => !n.isRead).length;

  return (
    <PageLayout>
      <PageHeader 
        title="Notifications & Settings" 
        description="Manage your alerts and account preferences"
      >
        {unreadCount > 0 && (
          <Button 
            variant="outline"
            onClick={markAllAsRead}
          >
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        )}
      </PageHeader>

      <Tabs defaultValue="notifications" className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" /> 
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card className="p-6 border shadow-card">
            <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
            
            {notificationsWithRead.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications to show
              </div>
            ) : (
              <div className="space-y-4">
                {notificationsWithRead.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "flex items-start p-4 rounded-lg transition-all duration-200",
                      notification.isRead 
                        ? "bg-muted/50" 
                        : "bg-primary/5 border border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      notification.isRead 
                        ? "bg-secondary text-muted-foreground" 
                        : "bg-primary/10 text-primary"
                    )}>
                      {getNotificationIcon(notification.title)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={cn(
                          "font-medium",
                          !notification.isRead && "text-primary"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="ml-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 gap-8">
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New expenses</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new expenses are added
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.expenses} 
                    onCheckedChange={() => toggleSetting('expenses')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Settlement requests</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about pending payments and settlements
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.settlements}
                    onCheckedChange={() => toggleSetting('settlements')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Budget alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're approaching or exceeding budgets
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.budget}
                    onCheckedChange={() => toggleSetting('budget')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Group activity</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new members and group changes
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.groups}
                    onCheckedChange={() => toggleSetting('groups')}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information
                    </p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Notifications;
