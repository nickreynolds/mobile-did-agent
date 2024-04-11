import { useChat } from '../../providers/ChatProvider'
import { IDataStoreORM, IMessage } from '@veramo/core'
import { useEffect } from 'react'
// import { Col, Row, theme } from '@ant-design/react-native'
// const { useToken } = theme
import { agent } from '../../setup'
import { useQuery } from 'react-query'
import ChatScrollPanel from './ChatScrollPanel'
import ChatThread from './ChatThread'
import { Text, View } from 'react-native'

const groupBy = (arr: any[], property: string) => {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur]
    return acc
  }, {})
}

interface IsSenderTaggedMessage extends IMessage {
  isSender: boolean
}

const Chats = () => {
  // const { token } = useToken()
  const { selectedDid } = useChat()
  // const { threadId } = useParams<{ threadId: string }>()
  console.log("selectedDid: ", selectedDid)
  const { data: threads, refetch } = useQuery(
    ['threads', { id: agent?.context?.id, selectedDid }],
    async () => {
      const messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['https://didcomm.org/basicmessage/2.0/message'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      })
      // TODO: should be able to do this filter in the query instead of here
      const applicableMessages = (messages as IMessage[])?.filter(
        (message) => message.from === selectedDid || message.to === selectedDid,
      )

      const senderTagged: IsSenderTaggedMessage[] = applicableMessages?.map(
        (message: any) => {
          return {
            ...message,
            isSender: message.from === selectedDid,
          }
        },
      )

      if (senderTagged) {
        const grouped = groupBy(senderTagged, 'threadId')
        return grouped
      }
    },
    {
      refetchInterval: 5000,
    },
  )
  useEffect(() => {
    refetch()
  }, [selectedDid, refetch])

  console.log("threads: ", threads)

  return (
        <View style={{ flexGrow: 1 }}>

        {threads &&
        Object.keys(threads).map((index: any) => {
            console.log("thread index: ", index)
            return (
            // <ChatThread
            //   thread={threads[index]}
            //   threadId={index}
            //   key={index}
            //   threadSelected={false}
            // />
            <Text key={index}>index</Text>
            )
        })}

        </View>
  )
}

export default Chats
