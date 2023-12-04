import { Button, Text, View } from "@gluestack-ui/themed";
import { styles } from "../styles";

export default function WorkerListItem({worker, edit=(()=>console.log("Edit Worker")), write=(()=>console.log("Write Worker"))}){
    return (
        <View style={styles.listItem}>
            <Text>{worker.data.name}</Text>
            <Button onPress={() => write(worker)}><Text>Write</Text></Button>
            <Button onPress={() => edit(worker)}><Text>Edit</Text></Button>
        </View>
    )
}