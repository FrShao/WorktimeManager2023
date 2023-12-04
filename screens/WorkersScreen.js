import { useEffect, useState } from "react"
import { getMultipleDocs } from "../lib/firebase"
import { FlatList, Text, View} from "@gluestack-ui/themed"
import WorkerListItem from "../lib/components/WorkerListItem"
import WorkerWrite from "../lib/components/WorkerWrite"

export default function WorkersScreen() {
    const [workers, setWorkers] = useState([])
    const [focusedWorker, setFocusedWorker] = useState({})
    const [showWritingModal, setShowWritingModal] = useState(false)

    useEffect(() => {
        const getWorkers = async() => {
            const res = await getMultipleDocs("workers")
            if(res.success){
                setWorkers(res.data)
            }else {
                console.warn("Unable to retrieve workers")
            }
        }
        getWorkers()
        return () => {
            
        }
    }, [])

    const handleWorkerWrite = async(worker) => {
        setFocusedWorker(worker)
        setShowWritingModal(true)
    }

    const handleWorkerEdit = (worker) => {

    }

    return (
        <View>
            <FlatList data={workers} renderItem={({item})=><WorkerListItem worker={item} write={handleWorkerWrite} edit={handleWorkerEdit}/>} />
            <WorkerWrite worker={focusedWorker} show={showWritingModal} onClose={()=>setShowWritingModal(false)}/>
        </View>
    )
}