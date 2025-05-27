<script>
export default {
  name: 'BadgeComponent',
  props: {
    url: String,
    pageConfig: Object,
  },
  computed: {
    size() {
      return `${Math.round(0.8 * this.pageConfig.fontSizeI + 4.4)}px`
    },
  },
}
</script>

<template>
  <img :src="url" class="badge" />
</template>

<style>
.badge {
  height: v-bind('size');
  vertical-align: -4px;
  margin-left: 4px;
  padding-right: 1px;
}
</style>
