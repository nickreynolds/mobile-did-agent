import { Button } from "react-native";
import { agent } from "../../setup";
import { useEffect, useState } from "react";
import { IIdentifier } from "@veramo/core";
import Ftue from "../ftue/Ftue";

const Home = ({navigation}) => {

    const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])

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
        // console.log('_ids:', _ids)
      }
  
      getIdentifiers()
    }, [])
  
    const onIDCreated = async () => {
      console.log("created!!")
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)
    }

    const showFtue = identifiers.length === 0 || identifiers[0].services.length === 0
    if (showFtue) {
        return (<Ftue onCreated={onIDCreated}/>)
    }

    return (
      <Button
        title="Go to Chats"
        onPress={() =>
          navigation.navigate('Chats')
        }
      />
    );
  };

  export default Home