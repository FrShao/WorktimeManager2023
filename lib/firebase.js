import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc, query, where, and } from "firebase/firestore"
import { nanoid } from "nanoid"

const firebaseConfig = {
  apiKey: "AIzaSyAXb28CaMqfzVXffsxFbon7LX8T_Ms4bqI",
  authDomain: "worktime-manager-52d52.firebaseapp.com",
  projectId: "worktime-manager-52d52",
  storageBucket: "worktime-manager-52d52.appspot.com",
  messagingSenderId: "766315646811",
  appId: "1:766315646811:web:64e9dda29e39a73159947e",
  measurementId: "G-TB9ZZFVXFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getMultipleDocs(table){
    let res = {
        data: null,
        success: true
    }
    try {
        const querySnapshot = await getDocs(collection(db, table))
        const docs = []
        querySnapshot.forEach((doc)=>{docs.push({id: doc.id, data: doc.data()})})
        res.data = docs
    } 
    catch (e) {
        res.success = false
        console.error("Error retrieving documents: ", e);
    }
    return res
}

export async function getSingleDoc(table, data){
    let res = {
        data: null,
        success: true
    }
    try {
        const querySnapshot = await getDoc(doc(db, table, data))
        if (querySnapshot.exists()) {
            res.data = querySnapshot.data()
        }
    } 
    catch (e) {
        res.success = false
        console.error("Error retrieving document: ", e);
    }
    return res
}

export async function getShift(worker_id, time){
    let res = {
        data: null,
        success: true
    }
    const workerRef = doc(db, "workers", worker_id)
    const docQuery = query(collection(db, "shifts"), and(
        where("worker_id", "==", workerRef),
        where("active", "==", true),   
        where("start", ">=", time-30),
        where("start", "<=", time+30)
    ))

    try {
        const querySnapshot = await getDocs(docQuery)
        const docs = []
        querySnapshot.forEach((doc)=>{docs.push({id: doc.id, data: doc.data()})})
        res.data = docs.length > 0 ? docs[0] : {}
    } 
    catch (e) {
        res.success = false
        console.error("Error retrieving shifts: ", e);
    }
    return res
}

 export async function getUnfinishedWorktime(worker_id, date){
    let res = {
        data: null,
        success: true
    }
    const workerRef = doc(db, "workers", worker_id)
    const tomorrow = new Date(date)
    tomorrow.setDate(date.getDate() + 1)
    let docQuery = query(collection(db, "worktime"), and(
        where("worker_id", "==", workerRef),
        where("start", ">=", date),
        where("start", "<=", tomorrow),
        where("end", "==", null)
    ))

    try {
        const querySnapshot = await getDocs(docQuery)
        const docs = []
        querySnapshot.forEach((doc)=>{docs.push({id: doc.id, data: doc.data()})})
        res.data = docs.length > 0 ? docs[0] : {}
    } 
    catch (e) {
        res.success = false
        console.error("Error retrieving unfinished worktime: ", e);
    }
    return res
}

export async function setWorktimeEnd(worktime_id, time){
    let success = true
    const worktimeRef = doc(db, "worktime", worktime_id)

    try {
        await updateDoc(worktimeRef, {
            end: time
        })
    } 
    catch (e) {
        success = false
    }
    return success
}


export async function createWorktime(worker_id, time){
    let res = {
        data: null,
        success: true
    }
    const workerRef = doc(db, "workers", worker_id)
    const shiftTime = time.getHours() * 100 + time.getMinutes()
    const shift = await getShift(worker_id, shiftTime)
    const shiftRef = Object.keys(shift.data) > 0 ? doc(db, "shifts", shift.data) : null
    
    try {
        await setDoc(doc(db, "worktime", nanoid(20)), {
            worker_id: workerRef,
            shift_id: shiftRef,
            start: time,
            end: null
        })
    } 
    catch (e) {
        res.success = false
        console.error("Error starting worktime: ", e);
    }
    return res
}

export async function getDocsRelatedToWorker(table, worker_id){
    let res = {
        data: null,
        success: true
    }
    const workerRef = doc(db, "workers", worker_id)
    const docQuery = query(collection(db, table), and(
        where("worker_id", "==", workerRef)
    ))
    try {
        if(table === "workers"){
            const worker = await getSingleDoc(table, worker_id)
            res.data = worker.success ? worker.data : null
        }else{
            const querySnapshot = table === "workers" ? await getDoc(workerRef) : await getDocs(docQuery)
            const docs = []
            querySnapshot.forEach((doc)=>{docs.push({id: doc.id, data: doc.data()})})
            res.data = docs
        }

    } 
    catch (e) {
        res.success = false
        console.error("Error retrieving shifts: ", e);
    }
    return res
}

export async function getWorkerDetails(worker_id){
    let res = {
        data: {},
        success: true
    }
    
    try {
        for(const table of ["workers", "shifts", "worktime"]){
            const subRes = await getDocsRelatedToWorker(table, worker_id)
            res.data[table] = subRes.success ? subRes.data : []
        }
        console.log(JSON.stringify(res.data))
    } 
    catch (e) {
        res.success = false
        console.error("Error starting worktime: ", e);
    }
    return res
}