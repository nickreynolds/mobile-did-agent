import React from 'react'
import { View } from 'react-native'

interface ChatScrollPanelProps {
  children: React.ReactNode
  reverse?: boolean
  id?: string
}

const ChatScrollPanel: React.FC<ChatScrollPanelProps> = ({
  children,
  reverse,
  id,
}) => {
  const reverseStyles = reverse
    ? {
        flexDirection: 'row-reverse',
      }
    : {
        flexDirection: 'column',
      }

  return (
    <View
      id={id}
      className={'hide-scroll'}
      // @ts-ignore
      style={{
        ...(reverse ? reverseStyles : {}),
        flex: 1,
        overflow: 'scroll',
      }}
    >
      <View id="scroll-items">{children}</View>
    </View>
  )
}

export default ChatScrollPanel
