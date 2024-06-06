import axios from 'axios';
import AuthService from '@/CyberryGeneral/services/AuthService.js';

const baseUrl = process.env.VUE_APP_UNITGENIUS_GATEWAY_URL;

const generators = [
  { 
    id: 1, 
    type: 2, 
    name: 'OpenAI GPT3 Document Generation', 
    description: 'Document generation using OpenAI Codex. Fast and relatively cheap.' 
  },
];

const GeneratorService = {
  getGenerators() {
    return generators;
  },
  setOpenedGenerator(generatorId) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('openedGeneratorId', generatorId);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  getOpenedGenerator() {
    try {
      const generatorId = localStorage.getItem('openedGeneratorId');
      const generator = generators.find(generator => generator.id == generatorId);
      return generator;
    } 
    catch (error) {
      console.error(error);
    }
  },
  async AddInput(type, code) {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const currentUser = await AuthService.getCurrentUser();
      const userId = currentUser.id;

      const input = {
        userId: userId,
        generationType: type,
        code: code
      };

      const response = await axios.post(`${baseUrl}/add`, input, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });

      return response.data;
    } 
    catch (error) {
      console.error(error);
    }
  },
  async RetrieveOutput(requestId) {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const currentUser = await AuthService.getCurrentUser();
      const userId = currentUser.id;

      const body = {
        userId: userId,
        requestId: requestId
      };

      const response = await axios.post(`${baseUrl}/retrieve`, body, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });

      return response.data;
    } 
    catch (error) {
      console.error(error);
    }
  },
};
  
export default GeneratorService;
  