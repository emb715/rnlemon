import React from 'react'
import {Path, Svg} from 'react-native-svg'

type IconProps = {
  size?: number
  fill: React.ComponentProps<typeof Svg>['fill']
} & React.ComponentProps<typeof Svg>

export const SearchIcon = ({size, fill, ...iconProps}: IconProps) => (
  <Svg viewBox="0 0 32 32" width={size} height={size} {...iconProps}>
    <Path
      fill={fill}
      d="m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9Z"
    />
  </Svg>
)
