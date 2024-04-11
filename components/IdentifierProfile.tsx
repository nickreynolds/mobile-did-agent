import React from 'react'
// import { Row, Avatar, Col, Typography, theme, Skeleton } from 'antd'
// import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifierProfilePlugin } from '../utils/IdentifierProfilePlugin'
import { shortId } from '../utils/did'
// import { IdentifierPopover } from './IdentifierPopover.js'
import { Text, View } from 'react-native'
import { agent } from '../setup'
import { Avatar } from 'react-native-elements'

interface IdentifierProfileProps {
  did: string
  showShortId?: boolean
  hidePopover?: boolean
}

export const IdentifierProfile: React.FC<IdentifierProfileProps> = ({
  did,
  showShortId = true,
  hidePopover = false,
}) => {

  const { data, isLoading } = useQuery(
    ['identifierProfile', { did, agentId: agent?.context?.id }],
    () => (did ? agent?.getIdentifierProfile({ did }) : undefined),
  )

  const content = (<View style={{ flexDirection: "row" }}>
    <View style={{ flexDirection: "column", marginRight: 1 }}>
      {!isLoading && <Avatar source={{uri: data?.picture}} />}
      {/* {isLoading && <Skeleton.Avatar active />} */}
    </View>
    <View style={{ flexDirection: "column" }}>
      <View style={{ display: 'flex' }}>
        {!isLoading && (
          <Text>{data?.name}</Text>
        )}
        {/* {isLoading && <Skeleton.Input style={{ width: 100 }} active />} */}
      </View>
      {showShortId && data?.name && data?.name !== shortId(did) && (
        <View>
          <Text>
            {shortId(did)}
          </Text>
        </View>
      )}
    </View>
  </View>)

    return content
//   if (hidePopover) return content

//   return (
//     <IdentifierPopover did={did}>
//       {content}
//     </IdentifierPopover>
//   )
}
