import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'


import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { IIdentifier } from '@veramo/core'
import { DIDResolutionResult } from '@veramo/core'
import { VerifiableCredential } from '@veramo/core'
import { IVerifyResult } from '@veramo/core'

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import Home from './pages/home/Home'
import { ChatProvider } from './providers/ChatProvider'
import Chats from './pages/chats/Chats'
const queryClient = new QueryClient()

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [resolutionResult, setResolutionResult] = useState<DIDResolutionResult | undefined>()
  const [credential, setCredential] = useState<VerifiableCredential | undefined>()
  const [verificationResult, setVerificationResult] = useState<IVerifyResult | undefined>()

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:peer',
      options: {
        num_algo: 2,
        service: { id: '1', type: 'DIDCommMessaging', serviceEndpoint: "did:web:dev-didcomm-mediator.herokuapp.com", description: 'for messaging' } 
      }
    })
    setIdentifiers((s) => s.concat([_id]))
  }

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)

      // Inspect the id object in your debug tool
      console.log('_ids:', _ids)
    }

    getIdentifiers()
  }, [])

  // Resolve a DID
  const resolveDID = async (did: string) => {
    const result = await agent.resolveDid({ didUrl: did })
    console.log(JSON.stringify(result, null, 2))
    setResolutionResult(result)
  }

  const createCredential = async () => {
    if (identifiers[0].did) {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifiers[0].did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:community.veramo.io',
            you: 'Rock',
          },
        },
        save: false,
        proofFormat: 'jwt',
      })

      setCredential(verifiableCredential)
    }
  }

  const verifyCredential = async () => {
    if (credential) {
      const result = await agent.verifyCredential({ credential })
      setVerificationResult(result)
    }
  }

  return (    
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{title: 'Welcome'}}
            />
            <Stack.Screen name="Chats" component={Chats} />
          </Stack.Navigator>
        </NavigationContainer>
      </ChatProvider>
    </QueryClientProvider>
  );
}

export default App