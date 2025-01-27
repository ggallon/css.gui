import { randomColor } from '../../lib/color'
import { stringifyUnit } from '../../lib/stringify'
import { Color } from '../../types/css'
import { ColorInput } from '../inputs/ColorInput'
import PalettePopover, {
  ThemeColor,
} from '../primitives/ColorPicker/PalettePicker'
import { isValidColor } from '../primitives/ColorPicker/util'
import { joinSchemas } from './joinSchemas'
import { keyword } from './primitives'
import { DataTypeSchema } from './types'

function rawColor({
  defaultValue = '#000',
}: {
  defaultValue?: Color
} = {}): DataTypeSchema<Color> {
  return {
    type: 'color',
    inlineInput: ColorInput,
    stringify: (value) => value,
    defaultValue,
    regenerate: () => randomColor(),
    validate: ((value: any) => {
      return typeof value === 'string' && isValidColor(value)
    }) as any,
    parse(tokens) {
      const [first, ...rest] = tokens
      // TODO hsl and stuff will be parsed as functions
      if (typeof first === 'string' && isValidColor(first)) {
        return [first, rest]
      }
      return [undefined, tokens]
    },
  }
}

const themeColor: DataTypeSchema<ThemeColor> = {
  type: 'theme',
  inlineInput: PalettePopover,
  stringify: (value) => value.path,
  defaultValue: { type: 'theme', path: 'primary' },
  regenerate: () => randomColor(),
  validate: ((value: any) => {
    if (typeof value !== 'object') return false
    return value.type === 'theme' && typeof value.path === 'string'
  }) as any,
  parse(tokens) {
    // TODO aaaargh how are we going to do this
    return [undefined, tokens]
  },
}

export function color({
  defaultValue = '#000000',
}: {
  defaultValue?: any
} = {}) {
  return joinSchemas([
    rawColor({ defaultValue }),
    themeColor,
    keyword(['transparent', 'currentcolor'], { type: 'system' }),
  ])
}
