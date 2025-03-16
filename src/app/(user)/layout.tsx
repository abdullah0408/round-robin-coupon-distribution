import { UserNavbar } from "./_components/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-background">
      <UserNavbar />
      <div className="flex-grow w-full">{children}</div>
    </div>
  );
}
