const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/train-model/data.json', 'utf-8'));

const tokenize = (text) => text.toLowerCase().split(/\s+/).filter(Boolean);
const allWords = Array.from(new Set(data.flatMap((item) => tokenize(item.message))));
const wordIndex = allWords.reduce((acc, word, index) => ({ ...acc, [word]: index + 1 }), {});

const encodeMessage = (text) => {
  const vector = Array(allWords.length).fill(0);
  tokenize(text).forEach((word) => {
    if (wordIndex[word]) {
      vector[wordIndex[word] - 1] = 1;
    }
  });
  return vector;
};

const xs = tf.tensor(data.map((item) => encodeMessage(item.message)));
const ys = tf.tensor(data.map((item) => item.label));

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [allWords.length], units: 10, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

async function train() {
  console.log('Start training...');
  await model.fit(xs, ys, { epochs: 10 });
  console.log('Training completed.');

  await model.save('file://model');
}

train().catch(console.error);