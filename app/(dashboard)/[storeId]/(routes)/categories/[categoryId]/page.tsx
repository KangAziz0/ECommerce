import db from "@/lib/db"
import { CategoryForm } from "./components/category-form"

const BannerPage = async ({params}:{params:{categoryId:string,storeId:string}}) =>{
    const category = await db.category.findUnique({
        where:{
            id:params.categoryId
        }
    })

    const banners  = await db.banner.findMany({
        where:{
            storeId:params.storeId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} banners={banners} />
            </div>
        </div>
    )
}
export default BannerPage