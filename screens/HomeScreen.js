import { Text, View } from "react-native"

import WorkerScan from "../lib/components/WorkerScan"

export default function HomeScreen() {
    return (
        <View>
            <WorkerScan/>
            <Text>
                Home
            </Text>
        </View>
    )
}