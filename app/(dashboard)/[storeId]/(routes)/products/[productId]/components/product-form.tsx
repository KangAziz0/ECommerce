"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { category, image, product } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


interface ProductFormProps {
    initialData: product & {
        images: image[]
    } | null
    categories: category[]
}

const formSchema = z.object({
    name: z.string().min(3),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    categoryId: z.string().min(1)
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Edit Product' : 'Buat Product'
    const description = initialData ? 'Edit Product Toko' : 'Buat Product Toko'
    const toastMessage = initialData ? 'Product Berhasil di Edit' : 'Product Berhasil Dibuat'
    const action = initialData ? 'Simpan Product' : 'Buat Product'
    const descriptionOfDelete = 'Apakah Anda Yakin Ingin Menghapus Data Ini !!!'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData, price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            isFeatured: false,
            isArchived: false,
            categoryId: ''
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/stores/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success('Product Berhasil Dihapus')
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
                    <FormField control={form.control} name="images" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUpload disabled={loading} onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])} onChange={(url) => field.onChange([...field.value, { url }])} value={field.value.map((image) => image.url)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama Product" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rp." disabled={loading} {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
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
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>
                                        Produk Ini Akan Muncul di Home Page
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isArchived" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>
                                        Produk Ini Akan Disembunyikan di Home Page
                                    </FormDescription>
                                </div>
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