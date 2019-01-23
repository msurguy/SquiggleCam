<template>
  <div class="navbar">
    <nav class="nav" @click="click">
      <button type="button" class="nav__button" data-action="restore" title="Undo (Ctrl + Z)" v-if="data.cropped"><span class="fa fa-undo"></span></button>
      <button type="button" class="nav__button nav__button--danger" data-action="remove" title="Delete (Delete)" v-if="data.loaded && !data.cropping"><span class="fa fa-trash"></span></button>
      <button type="button" class="nav__button nav__button--danger" data-action="clear" title="Cancel (Esc)" v-if="data.cropping"><span class="fa fa-ban"></span></button>
      <button type="button" class="nav__button nav__button--success" data-action="crop" title="OK (Enter)" v-if="data.cropping"><span class="fa fa-check"></span></button>
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        downloadable: typeof document.createElement('a').download !== 'undefined',
      };
    },

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    methods: {
      click({ target }) {
        const action = target.getAttribute('data-action') || target.parentElement.getAttribute('data-action');

        if (action) {
          this.$emit('change', action);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .navbar {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav__button {
    background-color: transparent;
    border-width: 0;
    color: #fff;
    cursor: pointer;
    display: block;
    float: left;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    width: 3rem;

  &:focus {
     outline: none;
   }

  &:hover {
     background-color: #0074d9;
     color: #fff;
   }
  }

  .nav--success:hover {
    background-color: #2ecc40;
  }

  .nav--danger:hover {
    background-color: #ff4136;
  }
</style>
