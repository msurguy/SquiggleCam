<template>
  <div class="locale-chooser">
    <select v-model="$i18n.locale">
      <option v-for="(name, lang) in langs" :key="lang" :value="lang">{{ name }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'locale-chooser',
  data () {
    return { langs: {'zh-TW':'中文', 'en-US':'English'} }
  }
}
</script>