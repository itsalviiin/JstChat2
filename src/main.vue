<template>
  <div id="main">
    <div id="index">
      <div id="title">просто чат 2</div>
      <span id="git">github: <a href="http://github.com/justririll">justririll</a></span> <br />
    </div>

    <div id="params">
      <div id="param">
        <span id="href" @click="$router.go(-1)" style="text-decoration: underline">ENG</span>
      </div>
      <div id="param">
        <span id="info">канал:</span> <br />
        <input type="text" placeholder="канал" v-model="channel" />
      </div>

      <div id="param">
        <span id="info">стиль:</span> <br />
        <select @change="changeStyle">
          <option value="1">с фоном</option>
          <option value="2">без фона</option>
        </select>
      </div>

      <div id="param">
        <span id="info">пример чата:</span> <br />
        @todo
      </div>

      <div id="param">
        <span id="info">ссылка:</span> <br />
        <input
          type="text"
          placeholder="фон"
          v-model="url"
          onclick="this.select(); navigator.clipboard.writeText(this.value);"
          readonly
        />
      </div>
      <br />
      <br />
      <br />

      <div id="param">
        <span id="info"> расширенные настройки: </span>
      </div>

      <div id="param">
        <span id="info">фон (HEX):</span> <br />
        <input type="text" placeholder="фон" v-model="background" />
      </div>
      <div id="param">
        <span id="info">сколько фонов:</span> <br />
        <input type="number" placeholder="количество фонов" v-model="num_backgrounds" />
      </div>
      <div id="param">
        <span id="info">border:</span>
        <input checked type="checkbox" placeholder="border" v-model="border" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  data: () => {
    return {
      channel: '',
      num_backgrounds: 4,
      background: '#2b2b2b',
      border: 'on',
    }
  },
  computed: {
    url() {
      let border = 0
      if (this.border == 'on') {
        border = 2
      }
      return `https://justririll.github.io/JstChat2/#/chat?channel=${this.channel}&background=${this.background}&sb=${this.num_backgrounds}&border=${border}`
    },
  },
  methods: {
    changeStyle(event) {
      switch (event.target.value.trim()) {
        case '1':
          this.border = 'on'
          this.background = '#2b2b2b'
          this.num_backgrounds = 4
          break

        case '2':
          this.border = 'off'
          this.background = 'transparent'
          this.num_backgrounds = '0'
          break
      }
    },
  },
}
</script>

<style>
#main {
  background: linear-gradient(#3e3e3e, #2b2b2b);
  background-attachment: fixed;
  color: white;
}
#title {
  max-width: fit-content;
  margin-inline: auto;
  font-size: 3em;
}
input {
  border: none;
  background: #2b2b2b;
  color: white;
  width: 14em;
  font-size: 2em;
}
#params {
  max-width: fit-content;
  margin-inline: auto;
  margin-top: 1em;
}
#param {
  margin-top: 1em;
}
#info {
  font-size: 2em;
  font-family: 'Roboto', sans-serif;
  margin-right: 2em;
}
a {
  text-decoration: none;
  color: rgb(142, 136, 151);
}
</style>
