import * as React from "react";
import { ListChecks, MoreVertical, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteTeamApi, teamListApi } from "@/api/authApi";
import { Link } from "react-router-dom";
import { Send } from "lucide-react"

export type User = {
    user_id: number;
    name: string;
    email: string;
};

export function TeamList() {
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            const response = await deleteTeamApi(selectedUser.user_id);
            setUsers((prev) => prev.filter((s) => s.user_id !== selectedUser.user_id));
            toast({
                title: "User Deleted",
                description: `${response.message}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            });
        }
        setIsDeleteDialogOpen(false);
    };

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await teamListApi();
            setUsers(response);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <ListChecks className="size-6 text-black" />
                    <h1 className="text-3xl font-extrabold text-black tracking-wide">Users</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchUsers}
                        disabled={loading}
                        className="transition-transform duration-200 hover:rotate-90"
                    >
                        <RefreshCw className={`size-5 ${loading ? "animate-spin text-gray-400" : "text-black"}`} />
                    </Button>
                </div>
            </div>
            {users.map((user) => (
                <Card
                    key={user.user_id}
                    className="bg-gray-900 border-none text-white"
                >
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <h3 className="text-md font-semibold text-white">{user.name}</h3>
                            <p className="text-xs font-semibold text-white">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to={`/status/${user.user_id}`} target="_blank" className="flex items-center">
                                <Send className="w-5 h-5 text-white" />
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 w-9 flex items-center justify-center">
                                        <MoreVertical className="h-5 w-5 text-white" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="min-w-24 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-2 space-y-1 transition-all duration-200"
                                >
                                    <DropdownMenuItem
                                        className="px-4 py-2 rounded-md transition-all duration-200 text-red-500 cursor-pointer"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            ))
            }

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
