import { useState, useEffect } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding: 20px;
  font-family: 'VT323', monospace;
  color: #ff0000;
  overflow-y: auto;
  text-shadow: 0 0 5px #ff0000;
`;

const TerminalInput = styled.input`
  background-color: transparent;
  border: none;
  color: #ff0000;
  font-family: 'VT323', monospace;
  font-size: 24px;
  width: 100%;
  text-shadow: 0 0 5px #ff0000;
  &:focus {
    outline: none;
  }
`;

const TerminalOutput = styled.div`
  margin: 10px 0;
  white-space: pre-wrap;
  font-size: 24px;
  line-height: 1.2;
`;

const Prompt = styled.span`
  color: #ff0000;
  text-shadow: 0 0 5px #ff0000;
`;

const MatrixBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  canvas {
    opacity: 0.05;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const Typewriter = styled.span`
  border-right: 2px solid #ff0000;
  animation: blink 1s step-end infinite;
  @keyframes blink {
    from, to { border-color: transparent }
    50% { border-color: #ff0000; }
  }
`;

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    'WELCOME TO WOPR',
    'LOGON: 24PWN',
    'PASSWORD: ********',
    '',
    'GREETINGS PROFESSOR FALKEN',
    '',
    'SHALL WE PLAY A GAME?',
    '',
    'Type "help" for available commands',
  ]);

  const commands = {
    help: () => [
      'Available commands:',
      'whoami    - Display information about me',
      'flag      - Get the flag',
      'clear     - Clear the terminal',
      'help      - Show this help message',
    ],
    whoami: () => [
      '24pwn',
      '-------------',
      'r/masterhacker on reddit',
    ],
    flag: () => ['flag{hahaha}'],
    clear: () => {
      setOutput([]);
      return [];
    },
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === '') return [];
    
    const command = commands[trimmedCmd];
    if (command) {
      return command();
    } else {
      return [`Command not found: ${cmd}. Type "help" for available commands.`];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOutput = [
      ...output,
      `> ${input}`,
      ...handleCommand(input),
    ];
    setOutput(newOutput);
    setInput('');
  };

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    document.querySelector('.matrix-background').appendChild(canvas);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cols = Math.floor(width / 20);
    const ypos = Array(cols).fill(0);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    function matrix() {
      ctx.fillStyle = '#0001';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#f00';
      ctx.font = '15pt monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    }

    const interval = setInterval(matrix, 50);

    return () => {
      clearInterval(interval);
      canvas.remove();
    };
  }, []);

  return (
    <>
      <MatrixBackground className="matrix-background" />
      <TerminalContainer>
        <ContentContainer>
          {output.map((line, i) => (
            <TerminalOutput key={i}>
              {line}
              {i === output.length - 1 && <Typewriter />}
            </TerminalOutput>
          ))}
          <form onSubmit={handleSubmit}>
            <Prompt>{'> '}</Prompt>
            <TerminalInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </form>
        </ContentContainer>
      </TerminalContainer>
    </>
  );
}

export default App;
