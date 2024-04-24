import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [pollingError, setPollingError] = useState(false);

  const handleButtonClick = async () => {
    try {
      setPollingError(false); // Reset polling error flag
      const inputRequestBody = {
        userId: "aa9ecc82-6bbb-4f1a-9903-2700cbf03fde",
        code: code,
        parameter: null
      };

      const inputResponseBody = await axios.post('http://inputservice-service:8080/add', inputRequestBody);
      console.log('inputResponseBody:', inputResponseBody);

      const outputRequestBody = {
        requestId: inputResponseBody.data.requestId,
        userId: inputResponseBody.data.userId
      };
      console.log('outputRequestBody:', outputRequestBody);
      
      // Start polling
      const startTime = Date.now();
      const timeout = 20000; // 20 seconds timeout
      while (true) {
        if (Date.now() - startTime > timeout) {
          throw new Error('Polling timeout');
        }
        const outputResponseBody = await axios.post(`http://outputservice-service:8081/retrieve`, outputRequestBody);
        console.log('outputResponseBody:', outputResponseBody);

        if (outputResponseBody.data.result) {
          setResult(outputResponseBody.data.result);
          break; // Exit polling loop when response is received
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
      }
    } catch (error) {
      console.error('Error:', error);
      setPollingError(true);
    }
  };

  return (
    <div className="App">
      <h1>Unit Test Generator</h1>
      <label>Code:</label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', height: '200px', marginBottom: '10px' }}
      />
      <button onClick={handleButtonClick}>Generate Unit Tests</button>
      {pollingError && <div style={{ color: 'red' }}>Error occurred during retrieval</div>}
      <div style={{ marginTop: '20px' }}>
        <h2>Response:</h2>
        <textarea
          value={result}
          readOnly
          style={{ width: '100%', height: '200px' }}
        />
      </div>
    </div>
  );
}

export default App;
