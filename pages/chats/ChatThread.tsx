import React from 'react'
// import { useNavigate } from 'react-router'
import { useChat } from '../../providers/ChatProvider'
import { useQuery } from 'react-query'
// import { useVeramo } from '@veramo-community/veramo-react'
import { agent } from '../../setup'
import { Text } from 'react-native'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'
// import ChatThreadProfileHeader from './ChatThreadProfileHeader'

interface ChatThreadProps {
  thread: any
  threadId: string
  threadSelected: boolean
  navigation: any
}

const ChatThread: React.FC<ChatThreadProps> = ({
  thread,
  threadId,
  threadSelected,
  navigation
}) => {
  const { selectedDid, setComposing } = useChat()
//   const navigate = useNavigate()
  const lastMessage = thread[thread.length - 1]
  const viewThread = () => {
    console.log("viewThread")
    setComposing(false)
    navigation.navigate(`Chat`, { threadId })
  }

  const counterPartyDid =
    lastMessage.from === selectedDid ? lastMessage.to : lastMessage.from

  const { data: profile } = useQuery(
    ['profile', counterPartyDid, agent?.context?.id],
    () =>
      counterPartyDid
        ? agent?.getIdentifierProfile({ did: counterPartyDid })
        : undefined,
  )

  console.log("profile: ", profile)


  return (
    <ChatThreadProfileHeader
      did={counterPartyDid}
      profile={profile}
      onRowClick={viewThread}
      selected={threadSelected}
      lastMessage={lastMessage}
    />
  )
}

export default ChatThread
