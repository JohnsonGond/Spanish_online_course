import { courseData, commonExpressions } from './course-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA (from course-data.js) ---
    const lessonPlan = courseData.lessonPlan || [];
    let currentPagePath = window.location.pathname.split('/').pop();
    if (currentPagePath === '') {
        currentPagePath = 'index.html'; // Handle root path
    } else if (!currentPagePath.includes('.')) {
        currentPagePath += '.html'; // Handle extensionless URLs like /lesson-01, /expressions etc.
    }
    
    const quizAnswers = courseData.quizData[currentPagePath];

    // --- ELEMENT SELECTORS ---
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const pageCounter = document.getElementById('page-counter');
    const slideJumpMenu = document.getElementById('slide-jump-menu');
    const totalSlides = slides.length;
    let currentSlide = 0;

    // --- NEW: EXPRESSIONS PAGE LOGIC ---
    function initializeExpressionsPage() {
        if (currentPagePath !== 'expressions.html') return;

        const container = document.getElementById('expressions-container');
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';

        for (const categoryKey in commonExpressions) {
            const category = commonExpressions[categoryKey];

            // Create card for the category
            const categoryCard = document.createElement('div');
            categoryCard.className = 'expression-card';

            // Create and append title
            const cardTitle = document.createElement('h2');
            cardTitle.textContent = category.title;
            categoryCard.appendChild(cardTitle);

            // Create list for expressions
            const expressionsList = document.createElement('ul');
            expressionsList.className = 'expression-list';

            category.expressions.forEach(expr => {
                const listItem = document.createElement('li');

                const spanishSpan = document.createElement('span');
                spanishSpan.className = 'lang-es';
                spanishSpan.textContent = expr.spanish;
                listItem.appendChild(spanishSpan);

                // Add speak icon (normal speed)
                const speakIcon = document.createElement('span');
                speakIcon.className = 'speak-icon';
                speakIcon.setAttribute('data-text', expr.spanish);
                listItem.appendChild(speakIcon);

                // Add speak icon (slow speed)
                const speakIconSlow = document.createElement('span');
                speakIconSlow.className = 'speak-icon-slow';
                speakIconSlow.setAttribute('data-text', expr.spanish);
                listItem.appendChild(speakIconSlow);

                const englishSpan = document.createElement('span');
                englishSpan.className = 'lang-en';
                englishSpan.textContent = expr.english;
                listItem.appendChild(englishSpan);

                const chineseSpan = document.createElement('span');
                chineseSpan.className = 'lang-zh';
                chineseSpan.textContent = expr.chinese;
                listItem.appendChild(chineseSpan);

                expressionsList.appendChild(listItem);
            });

            categoryCard.appendChild(expressionsList);
            container.appendChild(categoryCard);
        }
        
        // After creating all new speak icons, the global call at the end of the script will initialize them.
    }


    // --- MAIN SLIDE-PAGINATION LOGIC ---
    function showSlide(index) {
        currentSlide = index;
        slides.forEach((slide) => slide.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        sessionStorage.setItem(`currentSlideIndex_${currentPagePath}`, index);
        if (pageCounter) {
            pageCounter.textContent = `第 ${index + 1} / ${totalSlides} 页`;
        }
        if (prevButton) prevButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === totalSlides - 1;
        sessionStorage.setItem('currentSlideIndex', index);
        if (slideJumpMenu) {
            slideJumpMenu.value = index;
        }
    }

    // --- INTER-LESSON NAVIGATION LOGIC ---
    function initializeInterLessonNav() {
        const prevLessonLink = document.getElementById('prev-lesson-link');
        const nextLessonLink = document.getElementById('next-lesson-link');
        const currentIndex = lessonPlan.indexOf(currentPagePath);

        if (currentIndex === -1) return;

        const resetSlideIndex = () => {
            sessionStorage.removeItem('currentSlideIndex');
        };

        if (prevLessonLink) {
            if (currentIndex > 0) {
                prevLessonLink.href = lessonPlan[currentIndex - 1];
                prevLessonLink.classList.remove('hidden');
                prevLessonLink.addEventListener('click', resetSlideIndex);
            }
        }
        if (nextLessonLink) {
            if (currentIndex < lessonPlan.length - 1) {
                nextLessonLink.href = lessonPlan[currentIndex + 1];
                nextLessonLink.classList.remove('hidden');
                nextLessonLink.addEventListener('click', resetSlideIndex);
            }
        }
    }

    // --- JUMP MENU LOGIC ---
    function populateJumpMenu() {
        if (!slideJumpMenu) return;
        slideJumpMenu.innerHTML = '';
        slides.forEach((slide, index) => {
            const titleElement = slide.querySelector('h2');
            const title = titleElement
                ? titleElement.textContent.trim()
                : `第 ${index + 1} 页`;
            const option = new Option(title, index);
            slideJumpMenu.add(option);
        });
        slideJumpMenu.addEventListener('change', (e) => {
            showSlide(parseInt(e.target.value));
        });
    }

    // --- TEXT-TO-SPEECH LOGIC (AZURE TTS API) ---
    function initializeSpeakIcons() {
        const audio = new Audio();
        let isPlaying = false;

        const createSpeakHandler = (rate = 'default') => {
            return async (e) => {
                e.stopPropagation();
                if (isPlaying) return;

                const icon = e.target;
                const textToSpeak = icon.getAttribute('data-text');
                if (!textToSpeak) return;

                icon.classList.add('speaking');
                isPlaying = true;

                try {
                    const response = await fetch('/api/speak', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            text: textToSpeak,
                            rate: rate === 'slow' ? 'slow' : undefined,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(
                            `API request failed with status ${response.status}`,
                        );
                    }

                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);

                    audio.src = audioUrl;
                    audio.play();

                    audio.onended = () => {
                        icon.classList.remove('speaking');
                        URL.revokeObjectURL(audioUrl);
                        isPlaying = false;
                    };
                    audio.onerror = () => {
                        icon.classList.remove('speaking');
                        URL.revokeObjectURL(audioUrl);
                        isPlaying = false;
                        console.error('Audio playback error.');
                    };
                } catch (error) {
                    console.error('Text-to-speech failed:', error);
                    icon.classList.remove('speaking');
                    isPlaying = false;
                }
            };
        };

        document.querySelectorAll('.speak-icon').forEach((icon) => {
            icon.addEventListener('click', createSpeakHandler('default'));
        });

        document.querySelectorAll('.speak-icon-slow').forEach((icon) => {
            icon.addEventListener('click', createSpeakHandler('slow'));
        });
    }

    // --- FLASHCARD LOGIC ---
    function initializeFlashcards() {
        document.querySelectorAll('.flashcard').forEach((card) => {
            card.addEventListener('click', () =>
                card.classList.toggle('is-flipped'),
            );
        });
    }

    // --- QUIZ LOGIC ---
    function initializeQuiz() {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer || !quizAnswers) {
            if (quizContainer && !quizAnswers)
                console.warn(`No quiz data found for page: ${currentPagePath}`);
            return;
        }

        quizContainer
            .querySelectorAll('input[type="radio"]')
            .forEach((radio) => {
                radio.addEventListener('change', (event) => {
                    const qName = event.target.name;
                    const sValue = event.target.value;
                    const feedbackEl = document.getElementById(
                        `feedback-${qName}`,
                    );
                    if (!feedbackEl) return;
                    feedbackEl.textContent =
                        sValue === quizAnswers[qName]
                            ? '正确! (Correct!)'
                            : '错误 (Incorrect)';
                    feedbackEl.className = `question-feedback ${sValue === quizAnswers[qName] ? 'feedback-correct' : 'feedback-incorrect'}`;
                });
            });
    }

    // --- STOPWATCH WIDGET LOGIC (WITH COLLAPSIBLE UI) ---
    function initializeStopwatch() {
        const display = document.getElementById('stopwatch-display');
        if (!display) return;
        const toggleBtn = document.getElementById('stopwatch-toggle');
        const resetBtn = document.getElementById('stopwatch-reset');
        const widget = document.getElementById('stopwatch-widget');

        let intervalId = null,
            startTime = 0,
            elapsed = 0;
        let collapseTimeout = null;
        const isMobile = window.innerWidth < 768;

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const h = Math.floor(totalSeconds / 3600)
                .toString()
                .padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60)
                .toString()
                .padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        function updateColor(minutes) {
            widget.classList.remove(
                'stopwatch-green',
                'stopwatch-orange',
                'stopwatch-red',
            );
            if (minutes >= 100) {
                widget.classList.add('stopwatch-red');
            } else if (minutes >= 60) {
                widget.classList.add('stopwatch-orange');
            } else {
                widget.classList.add('stopwatch-green');
            }
        }

        function update() {
            const delta = Date.now() - startTime;
            const currentElapsed = elapsed + delta;
            display.textContent = formatTime(currentElapsed);
            updateColor(currentElapsed / 60000);
        }

        // --- Auto-collapse logic for mobile ---
        function resetCollapseTimer() {
            if (!isMobile) return;
            clearTimeout(collapseTimeout);
            collapseTimeout = setTimeout(() => {
                widget.classList.add('collapsed');
            }, 5000); // Collapse after 5 seconds of inactivity
        }

        function toggleCollapse(forceCollapse = false) {
            if (!isMobile) return;

            if (forceCollapse) {
                widget.classList.add('collapsed');
                clearTimeout(collapseTimeout);
            } else {
                widget.classList.toggle('collapsed');
            }

            // If it's now expanded, start the timer to auto-collapse it
            if (!widget.classList.contains('collapsed')) {
                resetCollapseTimer();
            } else {
                clearTimeout(collapseTimeout);
            }
        }

        function start() {
            if (intervalId) return;
            startTime = Date.now();
            intervalId = setInterval(update, 1000);
            toggleBtn.innerHTML = '⏸️';
            resetCollapseTimer();
        }

        function pause() {
            if (!intervalId) return;
            clearInterval(intervalId);
            const delta = Date.now() - startTime;
            elapsed += delta;
            intervalId = null;
            toggleBtn.innerHTML = '▶️';
            resetCollapseTimer();
        }

        function reset() {
            pause();
            elapsed = 0;
            display.textContent = formatTime(0);
            updateColor(0);
            localStorage.removeItem('stopwatchState');
            toggleBtn.innerHTML = '▶️';
            resetCollapseTimer();
        }

        function saveState() {
            if (intervalId) pause();
            const state = { elapsed };
            localStorage.setItem('stopwatchState', JSON.stringify(state));
        }

        function loadState() {
            const savedState = JSON.parse(
                localStorage.getItem('stopwatchState'),
            );
            if (savedState) {
                elapsed = savedState.elapsed || 0;
                display.textContent = formatTime(elapsed);
                updateColor(elapsed / 60000);
            }
        }

        function toggle() {
            if (intervalId) {
                pause();
            } else {
                start();
            }
        }

        // --- Event Listeners ---
        window.addEventListener('beforeunload', saveState);
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling to the display
                toggle();
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling to the display
                reset();
            });
        }
        display.addEventListener('click', () => toggleCollapse());

        // --- Initial State ---
        loadState();
        if (isMobile) {
            widget.classList.add('collapsed');
        }
    }

    // --- INITIALIZATION ORDER ---
    initializeExpressionsPage(); // Load expressions if on the correct page
    
    // The rest of the initializations are for the lesson pages
    if (slides.length > 0) {
        populateJumpMenu();
        const savedIndex =
            parseInt(sessionStorage.getItem(`currentSlideIndex_${currentPagePath}`)) || 0;
        showSlide(savedIndex >= 0 && savedIndex < totalSlides ? savedIndex : 0);

        // Attach main pagination events
        if (prevButton)
            prevButton.addEventListener('click', () => {
                if (currentSlide > 0) showSlide(currentSlide - 1);
            });
        if (nextButton)
            nextButton.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
            });
    }
    
    initializeInterLessonNav();
    initializeFlashcards();
    initializeQuiz();
    initializeStopwatch();
    
    // Initialize speak icons found on the page at load time.
    // Note: For expressions page, this is called again after dynamic content is created.
    initializeSpeakIcons();
});