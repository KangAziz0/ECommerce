"use client"

import { store } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { use, useState } from "react"
import { useModalStore } from "@/hooks/use-store-modal"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"

type PopperTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopperTriggerProps {
    items: store[]
}

const StoreSwitcher = ({
    className,
    items = []
}: StoreSwitcherProps) => {
    const storeModal = useModalStore()
    const params = useParams()
    const router = useRouter()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Pilih Toko" className={cn("w-[200px] justify-between", className)}>
                    <Store className="mr-2 h-4 w-4" />
                    {currentStore?.label || "Pilih Toko"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Cari Toko" />
                        <CommandEmpty>
                            Toko Tidak DItemukan
                        </CommandEmpty>
                        <CommandGroup heading="Toko">
                            {formattedItems.map((store) => (
                                <CommandItem key={store.value}
                                    onSelect={() => onStoreSelect(store)} className="text-sm">
                                    <Store className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false)
                                storeModal.onOpen()
                            }}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Buat Toko
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>

                </Command>
            </PopoverContent>
        </Popover>
    )
}
export default StoreSwitcher
