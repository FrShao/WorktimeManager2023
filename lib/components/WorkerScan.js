import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, View, Button, ButtonText } from "@gluestack-ui/themed"
import { useState } from "react"
import { NfcCancel, NfcRead } from "../nfc"
import { createWorktime, getShift, getSingleDoc, getUnfinishedWorktime, setWorktimeEnd } from "../firebase"


export default function WorkerScan(){
    const [show, setShow] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [worker, setWorker] = useState({})
    const [worktime, setWorktime] = useState({})

    const handleShowModal = async() => {
        setShow(true)
        setIsScanning(true)
        const res = await NfcRead()
        setIsScanning(false)
        if(res.success){
            setWorker({... await getSingleDoc("workers", res.data), id: res.data})
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            setWorktime((await getUnfinishedWorktime(res.data, today)).data)
        }
    }
    const handleCloseModal = () => {
        NfcCancel()
        if(isScanning){
            setIsScanning(false)
        }
        setShow(false)
    }
    const handleConfirmWorktime = async() => {
        const time = new Date()
        const worktime = await createWorktime(worker.id, time)
    }
    const handleEndWorktime = async() => {
        await setWorktimeEnd(worktime.id, new Date())
        handleCloseModal()
    }
    return (
        <View>
            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              onPress={handleShowModal}
            >
                <ButtonText>Scan</ButtonText>
            </Button>
            
            <Modal isOpen={show} onClose={handleCloseModal} closeOnOverlayClick={true} closeOnOverlayClick={true}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Text>{isScanning ? "Scanning ..." : "Badge found"}</Text>
                    </ModalHeader>
                    <ModalBody>
                        {!isScanning && Object.keys(worker).length > 0 &&
                            <Text>{worker.data.name}</Text>
                        }
                        {!isScanning && Object.keys(worktime).length > 0 && 
                            <View>
                                <Text>You seem to have an unended worktime, do you want to end it ?</Text>
                                <Button onPress={handleEndWorktime}><Text>Yes, I want</Text></Button>
                            </View>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ModalCloseButton><Text>Cancel</Text></ModalCloseButton>
                        {!isScanning && Object.keys(worker).length > 0 && 
                            <Button onPress={handleConfirmWorktime}><Text>Confirm</Text></Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </View>
    )
}