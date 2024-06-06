<template>
  <main>
    <FileMenu ref="fileMenu"/>
    <div class="generators" v-if="generators != null">
      <div class="header">
        <div class="left">
          <h1>Generators</h1>
        </div>  
        <div class="right">
          <button @click="loadData" class="circle-button button-icon" data-tooltip="Refresh"><MdRefresh /></button>
        </div>
      </div>

      <hr/>

      <div v-for="generator in generators" :key="generator.id" class="generator" @click="openGeneratorPopup(generator.id)">
        <div class="name">
          <span>{{ generator.name }}</span>
        </div>
        <div class="description">
          <span>{{ generator.description }}</span>
        </div> 
      </div>
    </div>

    <GeneratorPopup 
      ref="generatorPopup" 
      v-if="generatorPopupOpen" 
      @close="closeGeneratorPopup" />
  </main>
</template>

<script>
import GeneratorService from '@/services/GeneratorService';

import FileMenu from '../components/FileMenu.vue'
import GeneratorPopup from '../components/GeneratorPopup.vue'

import { MdRefresh } from "@kalimahapps/vue-icons"; //Refresh icon

export default {
  components: {
    FileMenu,
    GeneratorPopup,
    MdRefresh
  },
  data() {
    return {
      generators: [],
      generatorPopupOpen: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.generators = GeneratorService.getGenerators();
    },
    openGeneratorPopup(id) {
      GeneratorService.setOpenedGenerator(id);
      this.generatorPopupOpen = true;
    },
    closeGeneratorPopup() {
      GeneratorService.setOpenedGenerator(null);
      this.generatorPopupOpen = false;
    },
  }
}
</script>

<style scoped>
.body {
  background-color: #131313;
}
h1 {
  color: #c0c0c0;
  font-size: 20px;
  margin-top: 8px;
  margin-left: 8px;
}
  h2 {
    color: #929292;
    font-size: 16px;
    margin-top: 8px;
    margin-left: 8px;
    margin-bottom: 8px;
  }

  hr {
    margin: 10px 0;
    border: 0;
    border-top: 1px solid #5e5e5e;
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .generator {
    border: 1px solid #4e4e4e;
    background-color: #333333;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .generator:hover {
    background-color: #5e5e5e;
  }

  .name {
    color: #c0c0c0;
    font-size: 16px;
  }

  .description {
    color: #5e5e5e;
    font-size: 12px;
  }

  #time {
    margin-left: 8px;
    color: #888888;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  .generators {
    position: fixed;
    top: 2%;
    left: 10%;
    width: 80%;
    max-width: 80%;
    height: 96%;
    background-color: #1A1A1A;
    border-radius: 20px;
    padding: 10px;
    /* display: flex; */
    /* flex-direction: column; */
    justify-content: flex-start;
    color: #dddddd;
    font-size: 10px;
    /* overflow-x: auto; */
    overflow-y: auto;
  }

  .variable-block {
    margin-top: 20px;
  }

  .variable-block label {
    color: #5e5e5e;
  }

  .variable-block input,
  .variable-block select,
  .variable-block p,
  .variable-block textarea {
    width: 100%;
    height: 30px;
    background-color: #333333;
    border: 1px solid #5e5e5e;
    border-radius: 5px;
    padding: 5px;
    color: #dddddd;
    font-size: 11px;
  }

  .variable-block textarea {
    height: 50%;
  }

  .button-block {
    display: flex;
    justify-content: space-around;
    margin-top: auto;
  }
  .circle-button {
    width: 32px;
    height: 32px;
    background-color: #333333;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #4e4e4e;
    position: relative;
    cursor: pointer;
    margin-bottom: 3px;
    margin-left: 5px;
  }

  .circle-button::before {
    content: attr(data-tooltip); /* Use the data-tooltip attribute as the tooltip text */
    position: absolute;
    top: calc(100% + 5px); /* Center the tooltip horizontally */
    right: 50%; /* Position the tooltip to the right of the button */
    background-color: #4e4e4e;
    padding: 5px;
    border-radius: 5px;
    opacity: 0; /* Hide the tooltip by default */
    transition: opacity 0.3s ease, transform 0.3s ease; /* Add a transition for a smooth appearance */
    font-size: 11px; /* Set the font size of the tooltip */
    white-space: nowrap; /* Prevent the tooltip from wrapping to the next line */
    pointer-events: none; /* Prevent the tooltip from blocking mouse events */
  }

  .circle-button:hover::before {
    opacity: 1; /* Show the tooltip on hover */
    transform: translateY(+0px) translateX(+50%); /* Move the tooltip to the right */
    transition-delay: 0.5s; /* Delay the appearance of the tooltip by 1 second */
  }

  .circle-button:hover {
    background-color: #4e4e4e;
  }

  .button-icon {
    color: #dddddd;
    font-size: 18px;
  }

  .inactive {
    color: #4e4e4e !important; /* Grey text color */
    pointer-events: none !important; /* Disable pointer events */
  }
</style>
