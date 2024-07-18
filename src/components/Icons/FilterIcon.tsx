import React from 'react'
import {Path, Svg} from 'react-native-svg'

// https://iconbuddy.com/carbon

type IconProps = {
  size?: number
  fill: React.ComponentProps<typeof Svg>['fill']
} & React.ComponentProps<typeof Svg>

export const FilterIcon = ({size, fill, ...iconProps}: IconProps) => (
  <Svg viewBox="0 0 32 32" width={size} height={size} {...iconProps}>
    <Path
      fill={fill}
      d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2ZM6 6v3.59l8 8V26h4v-8.41l8-8V6Z"
    />
  </Svg>
)
