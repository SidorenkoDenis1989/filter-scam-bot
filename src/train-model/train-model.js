const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const BATCH_SIZE = 32;

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

function* dataGenerator() {
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    const xsBatch = tf.tensor(batch.map((item) => encodeMessage(item.message)));
    const ysBatch = tf.tensor(batch.map((item) => item.label));
    yield { xs: xsBatch, ys: ysBatch };
  }
}

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [allWords.length], units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

async function trainModel() {
  console.log('Start training with mini-batches...');
  for (let epoch = 1; epoch <= 10; epoch++) {
    let batchIndex = 0;
    for (const { xs, ys } of dataGenerator()) {
      await model.fit(xs, ys, { batchSize: BATCH_SIZE, epochs: 1, shuffle: false });
      batchIndex++;
      console.log(`Epoch ${epoch}, Batch ${batchIndex} completed.`);
      xs.dispose();
      ys.dispose();
    }
  }

  console.log('Training completed.');
  await model.save('file://src/train-model');
}

trainModel().catch(console.error);