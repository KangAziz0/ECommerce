"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { banner } from "@prisma/client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BannerColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"

interface BannerClientProps{
    data: BannerColumn[]
}

export const BannerClient: React.FC<BannerClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Banner (${data.length})`} description="Atur Banner Toko Anda"/>
                <Button onClick={()=> router.push(`/${params.storeId}/banners/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable data={data} columns={columns} searchKey="label"/>
        </>
    )
}
