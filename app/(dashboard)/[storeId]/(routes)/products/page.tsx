import db from "@/lib/db"
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/column"
import {format} from "date-fns"
import { formatter } from "@/lib/utils"

const ProductPage = async ({
    params
}:{params:{storeId:string}}) => {
    const products = await db.product.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            category:true,
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedProducts:ProductColumn[] = products.map((item) => ({
        id:item.id,
        name:item.name,
        price:formatter.format(item.price.toNumber()),
        category:item.category.name,
        isFeatured:item.isFeatured,
        isArchived:item.isArchived,
        createdAt: format(item.createdAt,"MMM do,yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}
export default ProductPage