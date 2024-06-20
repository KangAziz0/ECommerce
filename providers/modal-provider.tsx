"use client"

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect,useState } from "react"

export const ModalProvider = () => {
    const [isMutated,setIsMutated] = useState(false)
    useEffect(()=> {
        setIsMutated(true)
    },[])

    if (!isMutated) {
        return null
    }
    return (
        <>
        <StoreModal/>
        </>
    ) 
}
