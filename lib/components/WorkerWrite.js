import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, View, Button, ButtonText } from "@gluestack-ui/themed"
import { useState, useEffect } from "react"
import { NfcCancel, NfcWrite } from "../nfc"


export default function WorkerWrite({worker, show, onClose}){
    const [isWriting, setIsWriting] = useState(false)
    const [err, setErr] = useState("")

    useEffect(()=>{
        if(show){
            handleShowModal()
        }
    }, [show])
    
    const handleShowModal = async() => {
        setIsWriting(true)
        const res = await NfcWrite(worker.id)
        setIsWriting(false)
        if(!res){
            setErr("Failed to write the badge")
        }
    }

    const handleCloseModal = () => {
        if(isWriting){
            NfcCancel()
        }
        onClose()
    }
    return (
        <Modal isOpen={show} onClose={handleCloseModal} closeOnOverlayClick={true}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Text>{isWriting ? "Searching target ..." : "Badge found"}</Text>
                </ModalHeader>
                <ModalBody></ModalBody>
                <ModalFooter>
                    <ModalCloseButton><Text>Cancel</Text></ModalCloseButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}