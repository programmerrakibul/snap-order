import { getUserData } from "@/actions/server/user.action";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/shared/container";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconShield,
  IconCheck,
} from "@tabler/icons-react";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your profile",
};

const ProfilePage = async () => {
  const user = await getUserData();

  if (!user) return redirect("/auth/signin");

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  return (
    <section className="min-h-screen bg-linear-to-b from-background to-muted py-8 md:py-12">
      <Container>
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              My Profile
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Manage your account information and settings
            </p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1 overflow-hidden">
            <CardHeader className="border-b bg-muted/50 p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                {/* Avatar */}
                <Avatar size="lg" className="size-32">
                  <AvatarImage
                    src={user.photoURL || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-linear-to-br from-primary/20 to-primary/10">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* User Name */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">{user.name || "User"}</h2>

                  {/* Role Badge */}
                  <div className="flex gap-2 justify-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getRoleColor(user.role)}`}
                    >
                      {user.role === "ADMIN" ? (
                        <>
                          <IconShield size={14} className="mr-1" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <IconCheck size={14} className="mr-1" />
                          Customer
                        </>
                      )}
                    </Badge>

                    {user.isVerified && (
                      <Badge
                        variant="outline"
                        className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        <IconCheck size={14} className="mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <EditProfileModal user={user} />
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Email Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <IconMail size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-semibold break-all">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary contact email
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                  <IconPhone size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold">
                    {user.phoneNumber || (
                      <span className="text-muted-foreground font-normal">
                        Not provided
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.phoneNumber
                      ? "Your contact number"
                      : "Add a phone number to your profile"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Join Date Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                  <IconCalendar size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold">
                    {formatDate(user.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Account created date
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Last Login Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="rounded-lg bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                  <IconCheck size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Last Login
                  </p>
                  <p className="text-lg font-semibold">
                    {formatDate(user.lastLoggedIn)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your last session
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Settings Info */}
        <Card className="mt-8 bg-muted/50 border-muted">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Account Settings</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-primary" />
                Your email address cannot be changed for security reasons
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-primary" />
                Profile pictures should be in JPG, PNG, or WebP format (max 3MB)
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-primary" />
                Phone numbers must be 11 digits long
              </li>
            </ul>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};

export default ProfilePage;
