import React from 'react'
import {Path, Svg} from 'react-native-svg'

type IconProps = {
  size?: number
  fill: React.ComponentProps<typeof Svg>['fill']
} & React.ComponentProps<typeof Svg>

export const ChevronRightIcon = ({size, fill, ...iconProps}: IconProps) => (
  <Svg viewBox="0 0 32 32" width={size} height={size} {...iconProps}>
    <Path fill={fill} d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" />
  </Svg>
)
