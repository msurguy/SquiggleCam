<template>
  <div class="loader" @change="change" @dragover="dragover" @drop="drop">
    <p>Drop image here or
      <label class="browse">browse...
        <input class="sr-only" id="file" type="file"  accept="image/*">
      </label>
    </p>
  </div>
</template>

<script>
  const URL = window.URL || window.webkitURL;

  export default {
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    methods: {
      read(files) {
        return new Promise((resolve, reject) => {
          if (!files || files.length === 0) {
            resolve();
            return;
          }

          const file = files[0];

          if (/^image\/\w+$/.test(file.type)) {
            if (URL) {
              resolve({
                loaded: true,
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
              });
            } else {
              reject(new Error('Your browser is not supported.'));
            }
          } else {
            reject(new Error('Please choose an image file.'));
          }
        });
      },

      change({ target }) {
        this.read(target.files).then((data) => {
          target.value = '';
          this.update(data);
        }).catch((e) => {
          target.value = '';
          this.alert(e);
        });
      },

      dragover(e) {
        e.preventDefault();
      },

      drop(e) {
        e.preventDefault();
        this.read(e.dataTransfer.files).catch(this.alert);
      },

      alert(e) {
        window.alert(e && e.message ? e.message : e);
      },

      update(data) {
        Object.assign(this.data, data);
      },
    },
  };
</script>

<style scoped lang="scss">
  .loader {
    border: 2px #CCC dashed;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;

  .browse {
    color: #0074d9;
    cursor: pointer;
    margin-left: .25rem;
  }

  .sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
    z-index: -1;
  }

  }
</style>
