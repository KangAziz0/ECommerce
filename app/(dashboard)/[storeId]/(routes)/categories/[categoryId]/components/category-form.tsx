"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { banner, category } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface CategoryFormProps {
    initialData: category | null
    banners: banner[]
}

const formSchema = z.object({
    name: z.string().min(3),
    bannerId: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, banners }) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Edit Category' : 'Buat Category'
    const description = initialData ? 'Edit Category Toko' : 'Buat Category Toko'
    const toastMessage = initialData ? 'Category Berhasil di Edit' : 'Category Berhasil Dibuat'
    const action = initialData ? 'Simpan Category' : 'Buat Category'
    const descriptionOfDelete = 'Apakah Anda Yakin Ingin Menghapus Data Ini !!!'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            bannerId: ''
        }
    })

    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Cek Kembali Form Anda')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success('Category Berhasil Dihapus')
        } catch (error) {
            toast.error('Cek Kembali Form Anda')
            console.log(error);
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} description={descriptionOfDelete} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {
                    initialData &&
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Kategori</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama Kategori" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="bannerId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banner</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Pilih Banner" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {banners.map((banner) => (
                                                <SelectItem key={banner.id} value={banner.id}>
                                                    {banner.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}