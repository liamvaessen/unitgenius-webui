<template>
  <div class="popup-overlay" @click.self="closePopup" v-if="generator != null">
    <div class="popup-content">
      <span class="close-button" @click="closePopup">X</span>
      <div class="generator-popup" v-if="generator != null">
        <div class="variable-block">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="generator.name" readonly>
        </div>
        <div class="variable-block">
          <label for="type">Type:</label>
          <p type="text" id="type" v-if="generator.type == 0" style="background-color: #5e5e5e;">Unit Test</p>
          <p type="text" id="type" v-if="generator.type == 1" style="background-color: #00994D;">Document Generation</p>
          <p type="text" id="type" v-if="generator.type == 2" style="background-color: #5E55F3;">OpenAI Document Generation</p>
        </div>
        <div class="variable-block">
          <label for="description">Description:</label>
          <textarea id="description" v-model="generator.description" readonly></textarea>
        </div>
        <div class="variable-block">
          <label for="input">Input:</label>
          <textarea id="input" v-model="input"></textarea>
        </div>
        <div class="variable-block">
          <label for="output">Output:</label>
          <textarea id="output" v-model="output" readonly></textarea>
        </div>
        <div class="button-block">
          <button @click="generate" class="circle-button button-icon" data-tooltip="Generate"><BsPlayFill /></button>
          <button @click="stopGenerate" class="circle-button button-icon" data-tooltip="Stop"><BsStopFill  /></button>
          <button @click="retrieveOutput" class="circle-button button-icon" data-tooltip="Refresh"><MdRefresh /></button>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import GeneratorService from '@/services/GeneratorService';

//icons
import { BsPlayFill } from "@kalimahapps/vue-icons";
import { BsStopFill   } from "@kalimahapps/vue-icons";
import { MdRefresh   } from "@kalimahapps/vue-icons";


export default {
  components: {
    BsPlayFill,
    BsStopFill,
    MdRefresh
  },
  data() {
    return {
      generator: {
        id: null,
        name: null,
        type: null,
        description: null,
      },
      input: "",
      output: "",
      generating: false,
      requestId: null,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.generator = await GeneratorService.getOpenedGenerator();
    },
    async generate() {
      this.addInput();
      this.retrieveOutput();
    },
    stopGenerate() {
      this.generating = false;
      this.output = 'Generation stopped.';
    },
    closePopup() {
      GeneratorService.setOpenedGenerator(null);
      this.generator = null;
      this.$emit('close');
    },
    async addInput() {
      if (this.generator && this.generator.id) {
        this.generating = true;
        this.output = 'Generating...';

        try {
          const inputResponse = await GeneratorService.AddInput(this.generator.type, this.input);
          console.log('Input submitted. Response:', inputResponse);
          this.requestId = inputResponse.requestId;
          localStorage.setItem('requestId', this.requestId);
        } catch (error) {
          if (error.message === 'Network Error') {
            console.error('There was a problem connecting to the server.');
          } else {
            console.error(error);
          }
        }
      }
    },
    async retrieveOutput() {
      if (this.generator && this.generator.id) {
        this.generating = true;
        this.output = 'Generating...';
        this.requestId = localStorage.getItem('requestId');
        let generatingStatusCounter = 1;

        for (let i = 0; i < 20; i++) {
          try {
            if (this.generating == false) {
              return;
            }
            const outputResponse = await GeneratorService.RetrieveOutput(this.requestId);
            console.log('Output generated. Response:', outputResponse);

            if (outputResponse && outputResponse.result) {
              this.output = outputResponse.result;
              return;
            }
          } catch (error) {
            generatingStatusCounter++;
            if (generatingStatusCounter >= 4) {
              generatingStatusCounter = 1;
            }

            this.output = 'Generating' + '.'.repeat(generatingStatusCounter);

            console.error('No generation output yet, trying again. Error:', error);

            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        this.output = 'No output generated yet. Please try again later.';
      }
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.popup-content {
  background-color: #1A1A1A;
  border-radius: 10px;
  padding: 20px;
  width: 85%;
  height: 98%;
  overflow: auto; /* Enable scrolling if content overflows */
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

.generator-popup {
  color: #dddddd;
  font-size: 14px;
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
  border: 1px solid #4e4e4e;
  border-radius: 5px;
  padding: 5px;
  color: #dddddd;
  font-size: 14px;
}

.variable-block textarea {
  height: 120px;
}

.button-block {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
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
}

.circle-button::before {
  content: attr(data-tooltip); /* Use the data-tooltip attribute as the tooltip text */
  position: absolute;
  bottom: calc(100% + 5px); /* Center the tooltip vertically */
  left: 50%; /* Position the tooltip to the right of the button */
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
  transform: translateY(-5px) translateX(-50%); /* Move the tooltip to the right */
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
