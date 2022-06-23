import { get, range } from 'lodash-es'
import { ThemeValue } from '../../types/css'
import { SelectInput } from '../inputs/SelectInput'
import { useTheme } from '../providers/ThemeContext'
import { length } from './primitives'
import { DataTypeSchema } from './types'

export function theme(path: string): DataTypeSchema<ThemeValue> {
  return {
    type: 'theme',
    validate: ((value: any) => {
      if (typeof value !== 'object') return false
      return (
        value.type === 'theme' &&
        typeof value.path === 'string' &&
        typeof value.index === 'number'
      )
    }) as any,
    // XXX: Theme isn't being passed here
    stringify(value, theme = {}) {
      const path = `${value.path}.${value.index}`
      console.log({ theme })
      console.log(value, path)
      console.log(get(theme, path))
      console.log('------------')
      return get(theme, `${value.path}.${value.index}`)
    },
    inlineInput(props) {
      const theme = useTheme()
      const numOptions = get(theme, path).length

      return (
        <SelectInput
          label=""
          value={`${props.value.index + 1}`}
          onChange={(value) =>
            props.onChange({
              ...props.value,
              index: +value - 1,
            })
          }
          options={range(1, numOptions + 1).map((x) => x.toString())}
        />
      )
      // return null
    },
    // TODO function version of defaultValue, pass in theme
    defaultValue: { type: 'theme', path, index: 0 },
  }
}
