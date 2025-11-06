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

        // Favorites state
        const FAV_KEY = 'expressionFavorites';
        const loadFavorites = () => {
            try {
                return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []);
            } catch {
                return new Set();
            }
        };
        const saveFavorites = (set) => {
            localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(set)));
        };
        let favorites = loadFavorites();
        let searchQuery = '';
        let showOnlyFavorites = false;

        // Clear
        container.innerHTML = '';

        // Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'expressions-toolbar';
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = '搜索（西语/英语/中文）';
        searchInput.setAttribute('aria-label', '搜索常用表达');
        const favToggleLabel = document.createElement('label');
        favToggleLabel.className = 'fav-toggle-label';
        const favToggle = document.createElement('input');
        favToggle.type = 'checkbox';
        favToggle.setAttribute('aria-label', '仅看收藏');
        const favToggleText = document.createElement('span');
        favToggleText.textContent = '仅看收藏';
        favToggleLabel.appendChild(favToggle);
        favToggleLabel.appendChild(favToggleText);
        toolbar.appendChild(searchInput);
        toolbar.appendChild(favToggleLabel);
        container.appendChild(toolbar);

        // Render
        const render = () => {
            container.querySelectorAll('.expression-card').forEach((n) => n.remove());

            for (const categoryKey in commonExpressions) {
                const category = commonExpressions[categoryKey];

                const categoryCard = document.createElement('div');
                categoryCard.className = 'expression-card';
                const cardTitle = document.createElement('h2');
                cardTitle.textContent = category.title;
                categoryCard.appendChild(cardTitle);

                const expressionsList = document.createElement('ul');
                expressionsList.className = 'expression-list';

                category.expressions.forEach((expr) => {
                    const key = `${categoryKey}::${expr.spanish}`;
                    const haystack = `${expr.spanish} ${expr.english} ${expr.chinese}`.toLowerCase();
                    const matchQuery = searchQuery
                        ? haystack.includes(searchQuery.toLowerCase())
                        : true;
                    const matchFav = showOnlyFavorites ? favorites.has(key) : true;
                    if (!matchQuery || !matchFav) return;

                    const listItem = document.createElement('li');

                    // Favorite icon
                    const favIcon = document.createElement('span');
                    favIcon.className = 'favorite-icon';
                    favIcon.setAttribute('role', 'button');
                    favIcon.setAttribute('tabindex', '0');
                    favIcon.setAttribute(
                        'aria-label',
                        favorites.has(key)
                            ? `取消收藏：${expr.spanish}`
                            : `收藏：${expr.spanish}`,
                    );
                    if (favorites.has(key)) favIcon.classList.add('active');
                    const toggleFav = () => {
                        if (favorites.has(key)) {
                            favorites.delete(key);
                        } else {
                            favorites.add(key);
                        }
                        saveFavorites(favorites);
                        render();
                    };
                    favIcon.addEventListener('click', toggleFav);
                    favIcon.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleFav();
                        }
                    });
                    listItem.appendChild(favIcon);

                    const spanishSpan = document.createElement('span');
                    spanishSpan.className = 'lang-es';
                    spanishSpan.textContent = expr.spanish;
                    listItem.appendChild(spanishSpan);

                    const speakIcon = document.createElement('span');
                    speakIcon.className = 'speak-icon';
                    speakIcon.setAttribute('data-text', expr.spanish);
                    speakIcon.setAttribute('title', '发音');
                    speakIcon.setAttribute('aria-label', `播放发音：${expr.spanish}`);
                    speakIcon.setAttribute('role', 'button');
                    speakIcon.setAttribute('tabindex', '0');
                    listItem.appendChild(speakIcon);

                    const speakIconSlow = document.createElement('span');
                    speakIconSlow.className = 'speak-icon-slow';
                    speakIconSlow.setAttribute('data-text', expr.spanish);
                    speakIconSlow.setAttribute('title', '慢速发音');
                    speakIconSlow.setAttribute(
                        'aria-label',
                        `慢速播放发音：${expr.spanish}`,
                    );
                    speakIconSlow.setAttribute('role', 'button');
                    speakIconSlow.setAttribute('tabindex', '0');
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

            // Re-init speak handlers for new nodes
            initializeSpeakIcons();
        };

        // Bind events
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value || '';
            render();
        });
        favToggle.addEventListener('change', (e) => {
            showOnlyFavorites = !!e.target.checked;
            render();
        });

        // Initial render
        render();
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

        // Enhance accessibility and attach handlers
        document.querySelectorAll('.speak-icon').forEach((icon) => {
            const text = icon.getAttribute('data-text') || '';
            if (!icon.hasAttribute('title')) icon.setAttribute('title', '发音');
            icon.setAttribute('aria-label', `播放发音：${text}`);
            icon.setAttribute('role', 'button');
            icon.setAttribute('tabindex', '0');
            const onKey = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            };
            icon.addEventListener('keydown', onKey);
            icon.addEventListener('click', createSpeakHandler('default'));
        });

        document.querySelectorAll('.speak-icon-slow').forEach((icon) => {
            const text = icon.getAttribute('data-text') || '';
            if (!icon.hasAttribute('title')) icon.setAttribute('title', '慢速发音');
            icon.setAttribute('aria-label', `慢速播放发音：${text}`);
            icon.setAttribute('role', 'button');
            icon.setAttribute('tabindex', '0');
            const onKey = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            };
            icon.addEventListener('keydown', onKey);
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
                    const isCorrect = sValue === quizAnswers[qName];
                    const explanations = courseData.explanations || {};
                    const pageExplanations = explanations[currentPagePath] || {};
                    const extra = pageExplanations[qName] || '';
                    const base = isCorrect
                        ? '正确! (Correct!)'
                        : '错误 (Incorrect)';
                    feedbackEl.textContent = extra ? `${base} — ${extra}` : base;
                    feedbackEl.className = `question-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
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
            parseInt(
                sessionStorage.getItem(`currentSlideIndex_${currentPagePath}`),
            ) || 0;
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
    initializeDragDropPractice();

    // Initialize speak icons found on the page at load time.
    // Note: For expressions page, this is called again after dynamic content is created.
    initializeSpeakIcons();
});

// --- Drag & Drop Practice (Por vs Para etc.) ---
function initializeDragDropPractice() {
    const boards = document.querySelectorAll('.dnd-board');
    if (!boards.length) return;

    boards.forEach((board) => {
        const items = board.querySelectorAll('.dnd-item');
        const dropzones = board.querySelectorAll('.dnd-dropzone');
        const pool = board.querySelector('.dnd-pool');

        items.forEach((item) => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', 'dragging');
                e.dataTransfer.setData('text/id', (item.dataset.id = item.dataset.id || Math.random().toString(36).slice(2)));
                item.classList.remove('dnd-correct', 'dnd-incorrect');
            });
        });

        function handleDrop(e, dest) {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/id');
            const dragged = Array.from(board.querySelectorAll('.dnd-item')).find((x) => x.dataset.id === id);
            if (!dragged) return;
            dest.appendChild(dragged);
            // Mark correctness if dropped into a labeled column
            const bucketEl = dest.closest('.dnd-column');
            if (bucketEl && bucketEl.dataset.bucket) {
                const expected = dragged.dataset.category;
                const got = bucketEl.dataset.bucket;
                dragged.classList.remove('dnd-correct', 'dnd-incorrect');
                dragged.classList.add(expected === got ? 'dnd-correct' : 'dnd-incorrect');
            } else {
                dragged.classList.remove('dnd-correct', 'dnd-incorrect');
            }
        }

        [...dropzones, pool].forEach((dz) => {
            if (!dz) return;
            dz.addEventListener('dragover', (e) => e.preventDefault());
            dz.addEventListener('drop', (e) => handleDrop(e, dz));
        });
    });
}
