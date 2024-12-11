const fs = require('fs');

// Читаем исходный файл
const inputFilePath = 'src/train-model/result.json';
const outputFilePath = 'src/train-model/data2.json';

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
    }

    const uniqueMessages = new Set();

    const addMessageToSet = (message) => {
      if (message && typeof message === 'string' && message.trim() !== '') {
          uniqueMessages.add(JSON.stringify({ message: message.trim(), label: 0 }));
      }
    }


    try {
        const rawData = JSON.parse(data);
        
        if (!rawData.messages || !Array.isArray(rawData.messages)) {
            throw new Error('Ключ "messages" отсутствует или не является массивом.');
        }

        rawData.messages.forEach(item => addMessageToSet(item.text));
        const processedData = Array.from(uniqueMessages).map(item => JSON.parse(item));

        // Записываем обработанный файл
        fs.writeFile(outputFilePath, JSON.stringify(processedData, null, 2), 'utf8', err => {
            if (err) {
                console.error('Ошибка записи файла:', err);
            } else {
                console.log('Файл успешно обработан и сохранён.');
            }
        });
    } catch (parseErr) {
        console.error('Ошибка парсинга JSON:', parseErr);
    }
});
