import db from "@/lib/db"

interface DashboardPageProps{
    params: {
        storeId: string
    }
}

const DashboardLayout  = async ({params}:DashboardPageProps) => {
    const store  = await db.store.findFirst({
        where:{id: params.storeId}
    })
    return (
        <>
            Active Store {store?.name}
        </>
    )
}

export default DashboardLayout