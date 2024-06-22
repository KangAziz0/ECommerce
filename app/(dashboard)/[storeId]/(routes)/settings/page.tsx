import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SettingForm } from "./components/settings-form"

interface SettingPageProps {
    params: {
        storeId: string
    }
}

const SettingPage: React.FC<SettingPageProps> = async ({ params }) => {
    const { userId } = auth()
    if (!userId) {
        redirect('/sign-in')
    }
    const stores = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })
    if (!stores) {
        redirect('/')
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingForm  initialData={stores}/>
            </div>
        </div>
    )
}
export default SettingPage