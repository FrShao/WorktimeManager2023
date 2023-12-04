import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager"

// Initialize NFC Manager
export function NfcStart() {
    NfcManager.start()
}

export function NfcCancel() {
    NfcManager.cancelTechnologyRequest()
}

export async function NfcRead() {
    let response = {
        data: null,
        success: true
    }

    try {
        await NfcManager.requestTechnology(NfcTech.Ndef)
        const ndefMessage = (await NfcManager.getTag()).ndefMessage
        response.data = Ndef.text.decodePayload(ndefMessage[0].payload)
    }
    catch (err) {
        response.success = false
    }
    finally {
        NfcManager.cancelTechnologyRequest()
    }
    return response
}

export async function NfcWrite(data) {
    let success = true

    try {
        await NfcManager.requestTechnology(NfcTech.Ndef)
        const bytes = Ndef.encodeMessage([Ndef.textRecord(data)]);
        if (bytes) {
            await NfcManager.ndefHandler.writeNdefMessage(bytes)
        }
    }
    catch (err) {
        success = false
    }
    finally {
        NfcManager.cancelTechnologyRequest()
    }
    return success
}