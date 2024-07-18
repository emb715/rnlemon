import React from 'react'
import {Path, Svg} from 'react-native-svg'

type IconProps = {
  size?: number
  fill: React.ComponentProps<typeof Svg>['fill']
} & React.ComponentProps<typeof Svg>

export const SettingIcon = ({size, fill, ...iconProps}: IconProps) => (
  <Svg viewBox="0 0 32 32" width={size} height={size} {...iconProps}>
    <Path
      fill={fill}
      d="M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3zM2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z"
    />
  </Svg>
)
