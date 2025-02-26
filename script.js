document.addEventListener('DOMContentLoaded', () => {
    const textContentSpan = document.getElementById('text-content');
    const typingInput = document.getElementById('typing-input');
    const timeLeftSpan = document.getElementById('time-left');
    const wpmValueSpan = document.getElementById('wpm-value');
    const accuracyValueSpan = document.getElementById('accuracy-value');
    const cpmValueSpan = document.getElementById('cpm-value');
    const restartBtn = document.getElementById('restart-btn');
    const timeDurationSelect = document.getElementById('time-duration');
    const themeSelect = document.getElementById('theme-select');
    const languageSelect = document.getElementById('language-select');
    const customTextArea = document.getElementById('custom-text-area');
    const customTextInput = document.getElementById('custom-text-input');
    const loadCustomTextBtn = document.getElementById('load-custom-text-btn');
    const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
    const leaderboardMessage = document.getElementById('leaderboard-message');

    let testText = "";
    let timerInterval;
    let timeLeft = parseInt(timeDurationSelect.value);
    let wordsTyped = 0;
    let correctChars = 0;
    let incorrectChars = 0;
    let totalChars = 0;
    let testStarted = false;
    let startTime;

    // Text Data (Multilingual and Themed) - EXTENDED TEXTS
    const texts = {
        "quotes": {
            "en": [
                "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. And, like any great relationship, it just gets better and better as the years roll on. So keep looking until you find it, don't settle.",
                "Strive not to be a success, but rather to be of value. Look around at how people want to get more out of life than they put in. A man of value will give more in value than he receives. Be creative, but make sure that what you create is of value and not just something that looks good.",
                "The mind is everything. What you think you become. All that we are is the result of what we have thought. The mind is of utmost importance. Because if we believe in our minds, then we can do anything. This mind is what will give you power to achieve anything you wish to."
            ],
            "es": [
                "La única forma de hacer un gran trabajo es amar lo que haces. Si aún no lo has encontrado, sigue buscando. No te conformes. Como con todos los asuntos del corazón, sabrás cuándo lo encuentres. Y, como cualquier gran relación, simplemente mejora cada vez más a medida que pasan los años. Así que sigue buscando hasta que lo encuentres, no te conformes.",
                "No te esfuerces por ser un éxito, sino más bien por ser de valor. Mira a tu alrededor cómo la gente quiere sacar más de la vida de lo que pone en ella. Un hombre de valor dará más en valor de lo que recibe. Sé creativo, pero asegúrate de que lo que creas sea de valor y no sólo algo que se vea bien.",
                "La mente lo es todo. En lo que piensas te conviertes. Todo lo que somos es el resultado de lo que hemos pensado. La mente es de suma importancia. Porque si creemos en nuestra mente, entonces podemos hacer cualquier cosa. Esta mente es la que te dará el poder de lograr cualquier cosa que desees."
            ]
        },
        "proverbs": {
            "en": [
                "A journey of a thousand miles begins with a single step. This ancient proverb reminds us that even the most monumental tasks can be accomplished by starting with a small, initial action. It emphasizes the importance of taking initiative and not being overwhelmed by the magnitude of the overall goal. Every great achievement, no matter how large, is the result of a series of small steps taken in the right direction.",
                "Actions speak louder than words. This well-known saying highlights the significance of deeds over mere talk. It suggests that people's actions are a more reliable reflection of their character and intentions than their spoken words. True commitment and sincerity are demonstrated through behavior rather than promises or statements. What someone does is ultimately more telling than what they say.",
                "Better late than never. This proverb offers a comforting perspective on tardiness. While punctuality is generally valued, this saying suggests that it is preferable to accomplish something later than not at all. It encourages perseverance and discourages giving up on a task or goal simply because of a delay. Achieving a desired outcome, even if it's not on time, is still better than forgoing it entirely."
            ],
            "es": [
                "Un viaje de mil millas comienza con un solo paso. Este antiguo proverbio nos recuerda que incluso las tareas más monumentales se pueden lograr comenzando con una pequeña acción inicial. Enfatiza la importancia de tomar la iniciativa y no dejarse abrumar por la magnitud del objetivo general. Todo gran logro, sin importar cuán grande sea, es el resultado de una serie de pequeños pasos dados en la dirección correcta.",
                "Las acciones hablan más que las palabras. Este conocido dicho destaca la importancia de los hechos sobre la mera conversación. Sugiere que las acciones de las personas son un reflejo más fiable de su carácter e intenciones que sus palabras habladas. El verdadero compromiso y la sinceridad se demuestran a través del comportamiento en lugar de promesas o declaraciones. Lo que alguien hace es en última instancia más revelador que lo que dice.",
                "Más vale tarde que nunca. Este proverbio ofrece una perspectiva reconfortante sobre la tardanza. Si bien la puntualidad generalmente se valora, este dicho sugiere que es preferible lograr algo más tarde que no hacerlo en absoluto. Fomenta la perseverancia y desalienta a renunciar a una tarea u objetivo simplemente por una demora. Lograr el resultado deseado, incluso si no es a tiempo, sigue siendo mejor que renunciar a él por completo."
            ]
        },
        "dialogues": {
            "en": [
                "Hello, how are you doing today? It's a beautiful day, isn't it? - Yes, it is indeed! I'm doing well, thank you for asking.  I was just about to start practicing my typing skills. Have you tried the typing speed test website yet? - Oh, that sounds interesting! No, I haven't had a chance yet, but I've been meaning to improve my typing speed. Is it helpful? - Absolutely! It's a great way to track your progress and practice different types of texts. You should give it a try!",
                "What's your plan for today? Are you working on any exciting projects? - Actually, yes! I'm developing a typing speed test website using HTML, CSS, and JavaScript. - Wow, that's impressive! That's exactly what I was just asking about! What kind of features will it have? - It will have timed challenges, custom text entry, themed exercises like quotes and proverbs, progress tracking, multilingual support, and even a leaderboard for some friendly competition!",
                "Can you help me with this coding issue I'm facing? I've been stuck on it for hours. - Of course, I'd be happy to help! Let's take a look. What exactly is the problem you're encountering? - I'm trying to implement the leaderboard functionality for the typing test website, but I'm having trouble storing and retrieving the data from local storage. - Hmm, local storage can be a bit tricky sometimes. Let's walk through your code together, and we'll figure it out. Don't worry, we'll get it sorted out!"
            ],
            "es": [
                "Hola, ¿cómo estás hoy? Es un día hermoso, ¿verdad? - ¡Sí, lo es de verdad! Estoy bien, gracias por preguntar. Estaba a punto de empezar a practicar mis habilidades de mecanografía. ¿Ya has probado el sitio web de prueba de velocidad de escritura? - ¡Oh, eso suena interesante! No, todavía no he tenido la oportunidad, pero tenía la intención de mejorar mi velocidad de mecanografía. ¿Es útil? - ¡Absolutamente! Es una gran manera de seguir tu progreso y practicar diferentes tipos de textos. ¡Deberías probarlo!",
                "¿Cuáles son tus planes para hoy? ¿Estás trabajando en algún proyecto emocionante? - ¡En realidad, sí! Estoy desarrollando un sitio web de prueba de velocidad de escritura utilizando HTML, CSS y JavaScript. - ¡Vaya, eso es impresionante! ¡Eso es exactamente lo que te estaba preguntando! ¿Qué tipo de características tendrá? - Tendrá desafíos cronometrados, entrada de texto personalizado, ejercicios temáticos como citas y proverbios, seguimiento del progreso, soporte multilingüe, ¡e incluso una tabla de clasificación para una competencia amistosa!",
                "¿Puedes ayudarme con este problema de código al que me enfrento? Llevo horas atascado en él. - ¡Por supuesto, estaría encantado de ayudarte! Echemos un vistazo. ¿Cuál es exactamente el problema que estás encontrando? - Estoy tratando de implementar la funcionalidad de la tabla de clasificación para el sitio web de prueba de velocidad de escritura, pero estoy teniendo problemas para almacenar y recuperar los datos del almacenamiento local. - Hmm, el almacenamiento local puede ser un poco complicado a veces. Repasemos tu código juntos y lo resolveremos. ¡No te preocupes, lo solucionaremos!"
            ]
        }
    };

    let currentLanguage = languageSelect.value;
    let currentTheme = themeSelect.value;

    function loadText() {
        if (currentTheme === 'custom') {
            testText = customTextInput.value;
        } else {
            const languageTexts = texts[currentTheme][currentLanguage];
            testText = languageTexts[Math.floor(Math.random() * languageTexts.length)];
        }
        textContentSpan.textContent = testText;
    }

    function updateTimerDisplay() {
        timeLeftSpan.textContent = timeLeft;
    }

    function startTimer() {
        startTime = new Date().getTime();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                stopTest();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        testStarted = false;
    }

    function calculateWPM() {
        const timeInMinutes = (new Date().getTime() - startTime) / (1000 * 60);
        wordsTyped = typingInput.value.trim().split(/\s+/).filter(word => word).length;
        return Math.round(wordsTyped / timeInMinutes);
    }

    function calculateCPM() {
        return totalChars; // Characters per minute, approximation as it's characters typed so far
    }


    function calculateAccuracy() {
        if (totalChars === 0) return 100; // Avoid division by zero
        return Math.round((correctChars / totalChars) * 100);
    }

    function updateResultsDisplay() {
        wpmValueSpan.textContent = calculateWPM();
        cpmValueSpan.textContent = calculateCPM();
        accuracyValueSpan.textContent = calculateAccuracy();
    }

    function resetTest() {
        stopTimer();
        timeLeft = parseInt(timeDurationSelect.value);
        updateTimerDisplay();
        typingInput.value = '';
        textContentSpan.innerHTML = ''; // Clear text, important if using HTML for highlighting
        wpmValueSpan.textContent = '0';
        cpmValueSpan.textContent = '0';
        accuracyValueSpan.textContent = '100';
        wordsTyped = 0;
        correctChars = 0;
        incorrectChars = 0;
        totalChars = 0;
        testStarted = false;
        loadText(); // Load new text on restart
        typingInput.disabled = false;
    }

    function stopTest() {
        stopTimer();
        updateResultsDisplay();
        typingInput.disabled = true; // Disable input after test ends
        saveScoreToLeaderboard(calculateWPM());
    }

    typingInput.addEventListener('input', () => {
        if (!testStarted) {
            startTimer();
            testStarted = true;
        }

        const inputText = typingInput.value;
        totalChars = inputText.length;
        correctChars = 0;
        incorrectChars = 0;

        let textToDisplay = '';
        for (let i = 0; i < testText.length; i++) {
            if (i < inputText.length) {
                if (inputText[i] === testText[i]) {
                    textToDisplay += `<span class="correct">${testText[i]}</span>`;
                    correctChars++;
                } else {
                    textToDisplay += `<span class="incorrect">${testText[i]}</span>`;
                    incorrectChars++;
                }
            } else {
                textToDisplay += testText[i];
            }
        }
        textContentSpan.innerHTML = textToDisplay; // Use innerHTML for spans to work

        if (inputText.length >= testText.length) {
             stopTest(); // Stop test when typed text reaches or exceeds target text length
        }
    });

    restartBtn.addEventListener('click', resetTest);

    timeDurationSelect.addEventListener('change', () => {
        resetTest(); // Reset test when duration changes
        timeLeft = parseInt(timeDurationSelect.value);
        updateTimerDisplay();
    });

    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
        customTextArea.classList.toggle('hidden', currentTheme !== 'custom'); // Show/hide custom text area
        resetTest();
        loadText(); // Load new themed text
    });

    languageSelect.addEventListener('change', () => {
        currentLanguage = languageSelect.value;
        resetTest();
        loadText(); // Load new language text
    });

    loadCustomTextBtn.addEventListener('click', () => {
        resetTest();
        loadText(); // Load custom text from input
        customTextArea.classList.add('hidden'); // Hide custom text area after loading
        themeSelect.value = 'custom'; // Ensure theme select reflects custom selection
    });

    // Leaderboard functionality (Local Storage)
    const leaderboardStorageKey = 'typingTestLeaderboard';

    function getLeaderboard() {
        const leaderboardData = localStorage.getItem(leaderboardStorageKey);
        return leaderboardData ? JSON.parse(leaderboardData) : [];
    }

    function saveLeaderboard(leaderboard) {
        localStorage.setItem(leaderboardStorageKey, JSON.stringify(leaderboard));
    }

    function displayLeaderboard() {
        const leaderboard = getLeaderboard();
        leaderboardTableBody.innerHTML = ''; // Clear existing table rows
        if (leaderboard.length === 0) {
            leaderboardMessage.classList.remove('hidden'); // Show no scores message
        } else {
            leaderboardMessage.classList.add('hidden'); // Hide no scores message
            leaderboard.sort((a, b) => b.wpm - a.wpm); // Sort by WPM, highest first
            leaderboard.forEach((entry, index) => {
                const row = leaderboardTableBody.insertRow();
                row.insertCell(0).textContent = index + 1; // Rank
                row.insertCell(1).textContent = entry.name;
                row.insertCell(2).textContent = entry.wpm;
                row.insertCell(3).textContent = entry.date;
            });
        }
    }

    function saveScoreToLeaderboard(wpm) {
        if (wpm > 0) { // Only save valid scores
            const playerName = prompt("Enter your name for the leaderboard:", "Anonymous");
            if (playerName) {
                const leaderboardEntry = {
                    name: playerName,
                    wpm: wpm,
                    date: new Date().toLocaleDateString()
                };
                const leaderboard = getLeaderboard();
                leaderboard.push(leaderboardEntry);
                saveLeaderboard(leaderboard);
                displayLeaderboard();
            }
        }
    }

    // Initial setup
    updateTimerDisplay();
    loadText(); // Load initial text
    displayLeaderboard(); // Load and display leaderboard on page load
    customTextArea.classList.add('hidden'); // Initially hide custom text area
});