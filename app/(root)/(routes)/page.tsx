"use client"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/modal"
import { useModalStore } from "@/hooks/use-store-modal"
import { UserButton } from "@clerk/nextjs"
import { useEffect } from "react"

const SetupPage = () => {
  const onOpen = useModalStore((state) => state.onOpen)
  const isOpen = useModalStore((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen,onOpen])


  return (
    <nav className="p-4">
      <UserButton afterSignOutUrl="/"/>
    </nav>
  )
}
export default SetupPage
