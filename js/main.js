document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const lessonPlan = ['lesson-01.html'];

    // --- ELEMENT SELECTORS ---
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const pageCounter = document.getElementById('page-counter');
    const slideJumpMenu = document.getElementById('slide-jump-menu');
    const totalSlides = slides.length;
    let currentSlide = 0;

    // --- MAIN SLIDE-PAGINATION LOGIC ---
    function showSlide(index) {
        currentSlide = index;
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
        }
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
        const currentPagePath = window.location.pathname.split('/').pop();
        const currentIndex = lessonPlan.indexOf(currentPagePath);
        if (currentIndex === -1) return;
        if (currentIndex > 0 && prevLessonLink) {
            prevLessonLink.href = lessonPlan[currentIndex - 1];
            prevLessonLink.classList.remove('hidden');
        }
        if (currentIndex < lessonPlan.length - 1 && nextLessonLink) {
            nextLessonLink.href = lessonPlan[currentIndex + 1];
            nextLessonLink.classList.remove('hidden');
        }
    }

    // --- JUMP MENU LOGIC ---
    function populateJumpMenu() {
        if (!slideJumpMenu) return;
        slideJumpMenu.innerHTML = '';
        slides.forEach((slide, index) => {
            const titleElement = slide.querySelector('h2');
            const title = titleElement ? titleElement.textContent.trim() : `第 ${index + 1} 页`;
            const option = new Option(title, index);
            slideJumpMenu.add(option);
        });
        slideJumpMenu.addEventListener('change', (e) => {
            showSlide(parseInt(e.target.value));
        });
    }

    // --- TEXT-TO-SPEECH LOGIC ---
    function initializeSpeakIcons() {
        document.querySelectorAll('.speak-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const textToSpeak = e.target.closest('.speak-icon').getAttribute('data-text');
                if (textToSpeak && window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.lang = 'es-ES';
                    utterance.rate = 0.9;
                    window.speechSynthesis.speak(utterance);
                }
            });
        });
    }

    // --- FLASHCARD LOGIC ---
    function initializeFlashcards() {
        document.querySelectorAll('.flashcard').forEach(card => {
            card.addEventListener('click', () => card.classList.toggle('is-flipped'));
        });
    }

    // --- QUIZ LOGIC ---
    function initializeQuiz() {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer) return;
        const answers = {
            q1: 'b', // Una
            q2: 'a', // soy
            q3: 'c', // 电, 电学
            q4: 'b', // 大学
            q5: 'c', // es
            q6: 'b', // 7
            q7: 'b',  // no se pronuncia
            q8: 'b',  // hoy
            q9: 'b',  // informe
            q10: 'b', // difícil
            q11: 'b', // La
            q12: 'a'  // cinco
        };
        quizContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                const qName = event.target.name;
                const sValue = event.target.value;
                const feedbackEl = document.getElementById(`feedback-${qName}`);
                if (!feedbackEl) return;
                feedbackEl.textContent = sValue === answers[qName] ? '正确! (Correct!)' : '错误 (Incorrect)';
                feedbackEl.className = `question-feedback ${sValue === answers[qName] ? 'feedback-correct' : 'feedback-incorrect'}`;
            });
        });
    }

    // --- STOPWATCH WIDGET LOGIC (REFACTORED WITH TOGGLE BUTTON) ---
    function initializeStopwatch() {
        const display = document.getElementById('stopwatch-display');
        if (!display) return;
        const toggleBtn = document.getElementById('stopwatch-toggle');
        const resetBtn = document.getElementById('stopwatch-reset');
        const widget = document.getElementById('stopwatch-widget');
        let intervalId = null, startTime = 0, elapsed = 0;

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        function updateColor(minutes) {
            widget.classList.remove('stopwatch-green', 'stopwatch-orange', 'stopwatch-red');
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
        function start() {
            if (intervalId) return;
            startTime = Date.now();
            intervalId = setInterval(update, 1000);
            toggleBtn.innerHTML = '⏸️';
        }
        function pause() {
            if (!intervalId) return;
            clearInterval(intervalId);
            const delta = Date.now() - startTime;
            elapsed += delta;
            intervalId = null;
            toggleBtn.innerHTML = '▶️';
        }
        function reset() {
            pause();
            elapsed = 0;
            display.textContent = formatTime(0);
            updateColor(0);
            localStorage.removeItem('stopwatchState');
            toggleBtn.innerHTML = '▶️';
        }
        function saveState() {
            if (intervalId) pause();
            const state = { elapsed };
            localStorage.setItem('stopwatchState', JSON.stringify(state));
        }
        function loadState() {
            const savedState = JSON.parse(localStorage.getItem('stopwatchState'));
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
        window.addEventListener('beforeunload', saveState);
        toggleBtn.addEventListener('click', toggle);
        resetBtn.addEventListener('click', reset);
        loadState();
    }

    // --- INITIALIZATION ORDER ---
    populateJumpMenu();
    initializeInterLessonNav();
    initializeSpeakIcons();
    initializeFlashcards();
    initializeQuiz();
    initializeStopwatch();

    // --- FINAL STATE RESTORATION ---
    const savedIndex = parseInt(sessionStorage.getItem('currentSlideIndex')) || 0;
    showSlide(savedIndex >= 0 && savedIndex < totalSlides ? savedIndex : 0);

    // Attach main pagination events
    if (prevButton) prevButton.addEventListener('click', () => { if (currentSlide > 0) showSlide(currentSlide - 1); });
    if (nextButton) nextButton.addEventListener('click', () => { if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1); });
});
