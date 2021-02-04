<template>
  <textarea
    v-if="type === 'textarea'"
    v-model="inputValue"
    :required="required"
  ></textarea>
  <input v-else v-model="inputValue" :type="type" :required="required" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      required: false,
      default: () => [] as string[],
    },
    delimeter: {
      type: String,
      required: false,
      default() {
        return this.type === 'textarea' ? '\n' : ' '
      },
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      inputValue: this.value.join(this.delimeter),
    }
  },
  watch: {
    inputValue(newInputValue: string) {
      const newValue = newInputValue
        .trim()
        .split(this.delimeter)
        .filter((i) => i.trim().length !== 0)
      if (
        this.value.length !== newValue.length ||
        !this.value.every((val, index) => newValue[index] === val)
      )
        this.$emit('input', newValue)
    },
    value(newValue: string[]) {
      this.inputValue = newValue.join(this.delimeter)
    },
  },
})
</script>
