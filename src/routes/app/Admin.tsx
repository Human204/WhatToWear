import { DataTable } from "primereact/datatable";
import { useDeleteUser, useUsers } from "../../features/admin/api/useUsers";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function Admin() {
    const { data: users, isLoading } = useUsers();
    const { mutate: deleteUser, isPending } = useDeleteUser();

    return (
        <div className="flex flex-col items-center p-3 sm:px-11 sm:py-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <DataTable
                className="w-full max-w-[60rem]"
                value={users}
                loading={isLoading}
                showGridlines
                stripedRows
            >
                <Column field="username" header="Username"></Column>
                <Column field="email" header="Email"></Column>
                <Column
                    className="w-6"
                    body={({ id }: NonNullable<typeof users>[number]) => {
                        return (
                            <Button
                                icon="pi pi-trash"
                                severity="danger"
                                onClick={() => {
                                    deleteUser(id);
                                }}
                                loading={isPending}
                                text
                            />
                        );
                    }}
                ></Column>
            </DataTable>
        </div>
    );
}
