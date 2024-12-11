const fs = require('fs');

// ������ �������� ����
const inputFilePath = 'src/train-model/result.json';
const outputFilePath = 'src/train-model/data2.json';

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('������ ������ �����:', err);
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
            throw new Error('���� "messages" ����������� ��� �� �������� ��������.');
        }

        rawData.messages.forEach(item => addMessageToSet(item.text));
        const processedData = Array.from(uniqueMessages).map(item => JSON.parse(item));

        // ���������� ������������ ����
        fs.writeFile(outputFilePath, JSON.stringify(processedData, null, 2), 'utf8', err => {
            if (err) {
                console.error('������ ������ �����:', err);
            } else {
                console.log('���� ������� ��������� � �������.');
            }
        });
    } catch (parseErr) {
        console.error('������ �������� JSON:', parseErr);
    }
});
