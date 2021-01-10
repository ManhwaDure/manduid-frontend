<template>
  <input
    :value="formattedValue"
    :placeholder="placeholder"
    pattern="[0-9]{2,4}-[0-9]{3,5}-[0-9]{3,5}"
    type="tel"
    :required="required"
    @input="processInput($event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'

const formatPhoneNumber = function (str: string) {
  str = str.replace(/-/g, '')
  str = str
    .replace(/^(02|[0-9]{3})([0-9]*?)([0-9]{1,4})$/, '$1-$2-$3')
    .replace('--', '-')
  return str
}
const unhyphenPos = function (str: string, pos: number) {
  let newPos = pos
  for (let i = 0; i < pos; i++) {
    if (str[i] === '-') {
      newPos--
    }
  }
  return newPos
}
const hyphenPos = function (str: string, pos: number) {
  for (let i = 0; i < pos; i++) {
    if (str[i] === '-') {
      pos++
    }
  }
  return pos
}
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedValue() {
      return formatPhoneNumber(this.value)
    },
  },
  methods: {
    processInput(evt: Event) {
      const input = evt.target as HTMLInputElement
      input.value = input.value.replace(/[^0-9-]/g, '')
      let value = input.value
      let selStart = input.selectionStart || value.length - 1
      let selEnd = input.selectionEnd || value.length - 1
      selStart = unhyphenPos(value, selStart)
      selEnd = unhyphenPos(value, selEnd)
      value = formatPhoneNumber(value)
      selStart = hyphenPos(value, selStart)
      selEnd = hyphenPos(value, selEnd)
      input.value = value
      input.selectionStart = selStart
      input.selectionEnd = selEnd
      this.$emit('change', input.value)
    },
  },
})
</script>
