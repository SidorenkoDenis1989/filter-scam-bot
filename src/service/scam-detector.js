const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');


const MODEL_PATH = './src/train-model';
const DATA_PATH = './src/train-model/data.json';
class ScamDetector {
  constructor(modelPath, dataPath) {
    this.modelPath = modelPath;
    this.dataPath = dataPath;
    this.model = null;
    this.wordIndex = null;
  }
  
  async init() {
    try {
      const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
      const allWords = Array.from(new Set(data.flatMap((item) => item.message.toLowerCase().split(/\s+/).filter(Boolean))));
      this.wordIndex = allWords.reduce((acc, word, index) => ({ ...acc, [word]: index + 1 }), {});
      this.model = await tf.loadLayersModel(`file://${this.modelPath}/model.json`);
      console.log('Model and data loaded.');
    } catch (error) {
      console.error('Model loading error:', error.message);
    }
  }

  encodeMessage(text) {
    if (!this.wordIndex) {
      throw new Error("Data wasn't loaded.");
    }
    const vector = Array(Object.keys(this.wordIndex).length).fill(0);
    text.toLowerCase().split(/\s+/).forEach((word) => {
      if (this.wordIndex[word]) {
        vector[this.wordIndex[word] - 1] = 1;
      }
    });
    return tf.tensor([vector]);
  }

  async isSpamMessage(message) {
    if (!this.model) {
      console.error('Model loaded.');
      return false;
    }
    try {
      const input = this.encodeMessage(message);
      const prediction = this.model.predict(input);
      const [result] = await prediction.data();
      return result > 0.5; // Порог 0.5
    } catch (error) {
      console.error('Checking error:', error.message);
      return false;
    }
  }
}

const scamDetectorService = new ScamDetector(MODEL_PATH, DATA_PATH);
scamDetectorService.init();

module.exports = scamDetectorService;