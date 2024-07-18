import React from 'react'
import {Path, Svg} from 'react-native-svg'

type IconProps = {
  size?: number
  fill: React.ComponentProps<typeof Svg>['fill']
} & React.ComponentProps<typeof Svg>

export const UpdateNowIcon = ({size, fill, ...iconProps}: IconProps) => (
  <Svg viewBox="0 0 32 32" width={size} height={size} {...iconProps}>
    <Path fill={fill} d="m27 25.586l-2-2V21h-2v3.414L25.586 27L27 25.586z" />
    <Path
      fill={fill}
      d="M24 31a7 7 0 1 1 7-7a7.008 7.008 0 0 1-7 7zm0-12a5 5 0 1 0 5 5a5.005 5.005 0 0 0-5-5zm-8 9A12.013 12.013 0 0 1 4 16H2a14.016 14.016 0 0 0 14 14zM12 8H7.078A11.984 11.984 0 0 1 28 16h2A13.978 13.978 0 0 0 6 6.234V2H4v8h8z"
    />
  </Svg>
)
