const btn = document.getElementById('mic-btn');
const resultDiv = document.getElementById('result');
const transcriptDiv = document.getElementById('transcript');
const visualizer = document.getElementById('visualizer');
const statusText = document.getElementById('status');

// Configuração da Voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'pt-BR';

recognition.onstart = () => {
    btn.classList.add('active');
    visualizer.classList.add('listening');
    statusText.innerText = "Ouvindo...";
};

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    transcriptDiv.innerText = `"${transcript}"`;
    
    // Limpeza para o cálculo
    let expressao = transcript
        .replace(/vezes/g, '*')
        .replace(/dividido por/g, '/')
        .replace(/mais/g, '+')
        .replace(/menos/g, '-')
        .replace(/x/g, '*')
        .replace(/,/g, '.')
        .replace(/[^-+*/0-9.]/g, ''); // Remove letras

    try {
        let resultado = eval(expressao); // eval é seguro aqui pois o input é controlado pela regex
        resultDiv.innerText = resultado;
        falar(resultado);
    } catch (e) {
        resultDiv.innerText = "Erro";
        falar("Não consegui calcular");
    }
};

recognition.onend = () => {
    btn.classList.remove('active');
    visualizer.classList.remove('listening');
    statusText.innerText = "Toque para falar";
};

function falar(texto) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = `O resultado é ${texto}`;
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}

btn.onclick = () => {
    recognition.start();
};
