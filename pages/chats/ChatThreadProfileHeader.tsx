import React from 'react'
import { IMessage } from '@veramo/core'
import { useChat } from '../../providers/ChatProvider'
import { Text, View } from 'react-native'
import { shortId } from '../../utils/did'
import { IIdentifierProfile } from '../../utils/IdentifierProfilePlugin'
import { Avatar } from 'react-native-elements'

interface ChatThreadProfileHeaderProps {
  did: string
  profile?: IIdentifierProfile
  onRowClick?: any
  selected?: boolean
  lastMessage?: IMessage
}

const ChatThreadProfileHeader: React.FC<ChatThreadProfileHeaderProps> = ({
  did,
  profile,
  onRowClick,
  selected,
  lastMessage,
}) => {
  const { selectedDid } = useChat()

  return (
    <View
      onTouchEnd={onRowClick}
      style={{
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
        borderRadius: 2,
      }}
    >
      <View style={{ flexDirection: 'column', padding: 20 }}>
        <Avatar rounded source={{uri:profile?.picture}} size="small"/>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {profile ? (
          <View>
            <View>
              <Text style={{ marginBottom: 0 }}>
                {profile.name}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={{ marginBottom: 0 }}>
              {shortId(did)}
            </Text>
          </View>
        )}
        {lastMessage && lastMessage.type === 'https://didcomm.org/basicmessage/2.0/message' && (
          <Text style={{ color: 'gray' }}>
            {lastMessage.from === selectedDid && 'You: '}
            {String((lastMessage.data as any).content).substring(0, 10)}
          </Text>
        )}
      </View>
    </View>
  )
}

export default ChatThreadProfileHeader
