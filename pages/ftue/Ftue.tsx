import { IIdentifier } from "@veramo/core"
import { useState } from "react"
import { Button, View } from "react-native"
import { agent } from '../../setup'
import { createV3MediateRequestMessage, createV3RecipientUpdateMessage, Update, UpdateAction } from "@veramo/did-comm"

export interface FtueProps {
    onCreated: () => Promise<void>
}

const mediatorDID = "did:web:dev-didcomm-mediator.herokuapp.com"

const Ftue = ({ onCreated }: FtueProps) => {
    const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
    const sendMediationRequest = async (identifier: string) => {
        const message = createV3MediateRequestMessage(
          identifier,
          mediatorDID,
        )
    
        const stored = await agent?.dataStoreSaveMessage({ message: { ...message, to: message.to![0] } })
        console.log('stored?: ', stored)
    
        const packedMessage = await agent?.packDIDCommMessage({
          packing: 'authcrypt',
          message,
        })
    
        // requests mediation, and then message handler adds service to DID
        const result = await agent?.sendDIDCommMessage({
          packedMessage,
          messageId: message.id,
          recipientDidUrl: mediatorDID,
        })
    
        console.log('result?: ', result)
    
        const update: Update = { recipient_did: identifier, action: UpdateAction.ADD }
        const updateMessage = createV3RecipientUpdateMessage(identifier, mediatorDID, [update])
        const updateMessageContents = { packing: 'authcrypt', message: updateMessage } as const
        const packedUpdateMessage = await agent?.packDIDCommMessage(updateMessageContents)
        const updateResult = await agent?.sendDIDCommMessage({
          messageId: updateMessage.id,
          packedMessage: packedUpdateMessage,
          recipientDidUrl: mediatorDID,
        })

        console.log("mediation set. udpateResult: ", updateResult)
      }

    // Add the new identifier to state
    const createIdentifier = async () => {
        for (const id of identifiers) {
            console.log("delete old DID")
            await agent.didManagerDelete({ did: id.did })
        }

      const _id = await agent.didManagerCreate({
        provider: 'did:peer',
        options: {
          num_algo: 2,
          service: { id: '1', type: 'DIDCommMessaging', serviceEndpoint: "did:web:dev-didcomm-mediator.herokuapp.com", description: 'for messaging' } 
        }
      })
      console.log("new DID: ", _id)
      setIdentifiers((s) => s.concat([_id]))

      await sendMediationRequest(_id.did)

      onCreated()
    }

    return <>
        <View>
            <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
        </View>
    </>
}

export default Ftue