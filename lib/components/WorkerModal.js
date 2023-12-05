import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, View, Button, ButtonText } from "@gluestack-ui/themed"
import { useState, useEffect } from "react"
import { convertTimestamp, getWorkerDetails } from "../firebase"


export default function WorkerModal({worker, show, onClose}){
    const [isLoading, setIsLoading] = useState(false)
    const [err, setErr] = useState("")
    const [workerDetail, setWorkerDetail] = useState(null)

    useEffect(()=>{
        if(show){
            handleShowModal()
        }
    }, [show])
    
    const handleShowModal = async() => {
        setIsLoading(true)
        const res = await getWorkerDetails(worker.id)
        setIsLoading(false)
        if(res.success){
            console.log(res)
            setWorkerDetail(res.data)
        }else {
            setErr("Failed to retrieve worker data")
        }
    }

    const handleCloseModal = () => {
        onClose()
    }
    return (
        <Modal isOpen={show} onClose={handleCloseModal} closeOnOverlayClick={true}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Text>{isLoading ? "Loading ..." : "End"}</Text>
                </ModalHeader>
                <ModalBody>
                    {workerDetail && workerDetail.worktime.map((worktime)=><View><Text>{worktime.data.start.toDate().toDateString()}</Text><Text>{worktime.data.end.toDate().toDateString()}</Text></View>)}
                </ModalBody>
                <ModalFooter>
                    <ModalCloseButton><Text>Cancel</Text></ModalCloseButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}