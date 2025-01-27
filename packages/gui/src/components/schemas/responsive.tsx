import FieldArray from '../FieldArray'
import { DataTypeSchema } from './types'

export type Responsive<T> = { type: 'responsive'; values: T[] }

export function responsive<T>(
  itemSchema: DataTypeSchema<T>
): DataTypeSchema<Responsive<T>> {
  return {
    type: 'responsive',
    inlineInput({ value }) {
      return (
        <div sx={{ fontSize: 1 }}>
          {value.values.map((item) => itemSchema.stringify(item)).join(', ')}
        </div>
      )
    },
    input({ value, onChange }) {
      return (
        <ResponsiveInput
          value={value}
          onChange={onChange}
          itemSchema={itemSchema}
        />
      )
    },
    defaultValue: {
      type: 'responsive',
      values: [
        itemSchema.defaultValue,
        itemSchema.defaultValue,
        itemSchema.defaultValue,
      ],
    },
    validate: ((value: any) => {
      if (typeof value !== 'object') return false
      if (value.type !== 'responsive') return false
      if (!(value.values instanceof Array)) return false
      return value.values.map(itemSchema.validate)
    }) as any,
    regenerate({ previousValue }) {
      return {
        ...previousValue,
        values: previousValue.values.map(
          (value) =>
            itemSchema.regenerate?.({ previousValue: value }) ??
            itemSchema.defaultValue
        ),
      }
    },
    stringify(value) {
      return (value as any).values.map(itemSchema.stringify)
    },
  }
}

type ResponsiveInputProps<T> = {
  value: Responsive<T>
  onChange: (newValue: Responsive<T>) => void
  itemSchema: DataTypeSchema<T>
}
export function ResponsiveInput<T>({
  value,
  onChange,
  itemSchema,
}: ResponsiveInputProps<T>) {
  return (
    <FieldArray
      label=""
      itemSchema={itemSchema}
      value={value.values}
      onChange={(newValues) => {
        onChange({ ...value, values: newValues })
      }}
    />
  )
}
