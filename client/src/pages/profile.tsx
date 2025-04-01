import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="material-icons animate-spin text-primary-500">refresh</span>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <span className="material-icons text-error">error</span>
        </div>
        <h3 className="mb-2 text-lg font-medium">Error Loading Profile</h3>
        <p className="mb-6 text-neutral-600">
          We couldn't load your profile information. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">My Profile</h1>
        <p className="text-neutral-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <span className="material-icons text-4xl">person</span>
              </div>
              <CardTitle className="text-xl">{user.fullName}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-col items-start justify-start h-auto">
                  <TabsTrigger value="profile" className="w-full justify-start">
                    <span className="material-icons mr-2 text-sm">account_circle</span>
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="w-full justify-start">
                    <span className="material-icons mr-2 text-sm">lock</span>
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start">
                    <span className="material-icons mr-2 text-sm">notifications</span>
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="data" className="w-full justify-start">
                    <span className="material-icons mr-2 text-sm">backup</span>
                    Data & Storage
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <TabsContent value="profile" className="mt-0">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        defaultValue={user.fullName}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        defaultValue={user.username}
                        disabled
                        className="bg-neutral-50"
                      />
                      <p className="text-xs text-neutral-500">Username cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email || ""}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePassword}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                      />
                      <p className="text-xs text-neutral-500">
                        Password must be at least 8 characters with a mix of letters, numbers, and symbols
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-neutral-50 p-4">
                    <p className="text-center text-neutral-600">
                      Notification settings will be available in a future update.
                    </p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="data" className="mt-0">
              <CardHeader>
                <CardTitle>Data & Storage</CardTitle>
                <CardDescription>
                  Manage your data and storage settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-neutral-50 p-4">
                    <h3 className="mb-2 font-medium">Export Your Data</h3>
                    <p className="mb-4 text-sm text-neutral-600">
                      Download a copy of your financial data including expenses, goals, and budget information.
                    </p>
                    <Button variant="outline">
                      <span className="material-icons mr-2 text-sm">download</span>
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="rounded-md bg-neutral-50 p-4">
                    <h3 className="mb-2 font-medium">Clear App Data</h3>
                    <p className="mb-4 text-sm text-neutral-600">
                      Clear locally cached data to free up space. This won't delete your account data.
                    </p>
                    <Button variant="outline">
                      <span className="material-icons mr-2 text-sm">delete_sweep</span>
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="rounded-md border border-error/20 bg-error/5 p-4">
                    <h3 className="mb-2 font-medium text-error">Danger Zone</h3>
                    <p className="mb-4 text-sm text-neutral-600">
                      Delete your account and all associated data. This action is irreversible.
                    </p>
                    <Button variant="destructive">
                      <span className="material-icons mr-2 text-sm">delete_forever</span>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
