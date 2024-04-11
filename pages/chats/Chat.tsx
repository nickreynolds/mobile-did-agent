import React, { useEffect } from 'react'
import ChatScrollPanel from './ChatScrollPanel'
// import ChatBubble from './ChatBubble'
// import ChatInput from './ChatInput'
import { useQuery } from 'react-query'
// import { scrollMessages } from './scroll'
import { useChat } from '../../providers/ChatProvider'
import { agent } from '../../setup'
import { Button, Text, View } from 'react-native'
import type { RouteProp } from '@react-navigation/native';
import { IdentifierProfile } from '../../components/IdentifierProfile'

const Chat: React.FC = ( { route, navigation }) => {
    console.log("route: ", route)
  const { threadId } = route.params
  const { selectedDid, newRecipient } = useChat()
  const newThread = threadId === 'new-thread'


  const { data: messages, refetch } = useQuery(
    ['chats', { id: agent?.context?.id, threadId: threadId }],
    async () => {
      const _messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'threadId', value: [threadId] }],
        order: [{ column: 'createdAt', direction: 'ASC' }],
      })
      return _messages?.map((_msg: any) => {
        return {
          ..._msg,
          isSender: _msg.from === selectedDid,
        }
      })
    },
    {
      refetchInterval: 5000,
      enabled: !newThread,
    },
  )
  const lastMessage =
    threadId && messages && messages.length > 0 && messages[messages.length - 1]
  const counterParty = lastMessage
    ? {
        did:
          lastMessage.from === selectedDid ? lastMessage.to : lastMessage.from,
      }
    : { did: newRecipient }
//   useEffect(() => {
//     scrollMessages()
//   }, [messages])
  useEffect(() => {
    refetch()
  }, [selectedDid, refetch])

  if (
    !newThread &&
    selectedDid !== lastMessage?.to &&
    selectedDid !== lastMessage?.from
  ) {
    return <View/>
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 2,
          borderBottomColor: 'black',
          marginBottom: 1,
        }}
      >
        {/* <View style={{ flexDirection: 'column'}}>
          <Button
            type="text"
            onClick={() => navigate('/chats')}
            size={'large'}
          >
            <LeftOutlined />
          </Button>
        </View> */}
        <View style={{ flexDirection: 'column'}}>
          <IdentifierProfile did={counterParty.did} showShortId={false} />
        </View>
        <View style={{ flexDirection: 'column'}}>
          {/* <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate('/contacts/' + counterParty.did)}
          /> */}
        </View>
      </View>
      <ChatScrollPanel reverse id="chat-window">
        {messages?.map((message: any) => {
          return (
            // <ChatBubble
            //   // @ts-ignore
            //   text={message?.data?.content}
            //   key={message.id}
            //   // @ts-ignore
            //   isSender={message.isSender}
            // />
            <Text>{message?.data?.content}</Text>
          )
        })}
      </ChatScrollPanel>
      {/* {(messages || newThread) && (
        <ChatInput
          threadId={threadId}
          viewer={selectedDid}
          recipient={
            messages && messages.length > 0 && messages[0].from !== selectedDid
              ? messages && messages.length > 0 && messages[0].from
              : messages && messages.length > 0 && messages[0].to
          }
        />
      )} */}
    </View>
  )
}

export default Chat
