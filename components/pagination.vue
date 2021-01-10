<template>
  <nav class="pagination" role="navigation" aria-label="페이지 이동">
    <a
      v-if="maximum !== minimum && value > minimum"
      href="#"
      class="pagination-previous"
      @click.prevent="goPage(value - 1)"
      >이전</a
    >
    <a
      v-if="maximum !== minimum && value < maximum"
      href="#"
      class="pagination-next"
      @click.prevent="goPage(value + 1)"
      >다음</a
    >
    <ul class="pagination-list">
      <template v-if="firstLink">
        <li>
          <a
            href="#"
            class="pagination-link"
            :class="{ 'is-current': value === firstLink }"
            @click.prevent="goPage(firstLink)"
          >
            {{ firstLink }}
          </a>
        </li>
        <li>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      </template>
      <li v-for="link in links" :key="link">
        <a
          href="#"
          class="pagination-link"
          :class="{ 'is-current': value === link }"
          @click.prevent="goPage(link)"
          >{{ link }}</a
        >
      </li>
      <template v-if="lastLink">
        <li>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li>
          <a
            href="#"
            class="pagination-link"
            :class="{ 'is-current': value === lastLink }"
            @click.prevent="goPage(lastLink)"
          >
            {{ lastLink }}
          </a>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
    maximum: {
      type: Number,
      default: 1,
    },
    minimum: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    firstLink(): number | null {
      if (!this.links.includes(this.minimum)) return this.minimum
      else return null
    },
    lastLink(): number | null {
      if (!this.links.includes(this.maximum)) return this.maximum
      else return null
    },
    links(): number[] {
      const { value, maximum, minimum } = this as {
        value: number
        maximum: number
        minimum: number
      }
      const links = [value]
      for (let i = 1; i <= 2; i++) {
        if (value - i <= maximum && value - i >= minimum)
          links.unshift(value - i)
        if (links.length === 3) break
        if (value + i <= maximum && value + i >= minimum) links.push(value + i)
        if (links.length === 3) break
      }

      return links
    },
  },
  methods: {
    goPage(n: number) {
      this.$emit('change', n)
    },
  },
})
</script>
