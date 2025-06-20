// Application data and state management
class EmotionApp {
    constructor() {
        this.currentSection = 'home';
        this.journalEntries = [];
        this.audioPlayers = {};
        this.vulnerabilityAnswers = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTabs();
        this.setupVulnerabilityTest();
        this.setupIntensitySlider();
        this.setupTechniqueTabs();
        this.setupModals();
        this.setupAudioPlayers();
        this.setupForms();
    }

    // Navigation Management
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });

        this.currentSection = sectionId;
    }

    // Tab Management
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.showTab(tabId, btn.closest('.section'));
            });
        });
    }

    showTab(tabId, container) {
        // Hide all tab contents in this container
        const tabContents = container.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show target tab content
        const targetContent = container.querySelector(`#${tabId}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Update tab buttons
        const tabButtons = container.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
    }

    // Vulnerability Test
    setupVulnerabilityTest() {
        const questions = [
            "Często wstydzę się gdy popełniam błędy przy innych",
            "Unikam sytuacji gdzie mogę być oceniony/a",
            "Martwię się tym co inni o mnie myślą",
            "Czuję się nieswojo w centrum uwagi",
            "Wstydzę się swojego wyglądu",
            "Trudno mi mówić o swoich problemach",
            "Porównuję się z innymi i czuję się gorszy/a",
            "Gdy się wstydzę, chcę się ukryć",
            "Wstyd wpływa na moje decyzje",
            "Trudno mi mówić o swoim wstydzie"
        ];

        const container = document.getElementById('vulnerability-questions');
        if (container) {
            // Clear any existing content
            container.innerHTML = '';
            
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                questionDiv.innerHTML = `
                    <div class="question-text">${question}</div>
                    <div class="rating-buttons">
                        ${[1,2,3,4,5].map(num => 
                            `<button class="rating-btn" data-question="${index}" data-value="${num}">${num}</button>`
                        ).join('')}
                    </div>
                `;
                container.appendChild(questionDiv);
            });

            // Add click handlers for rating buttons
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('rating-btn')) {
                    const question = e.target.dataset.question;
                    const value = e.target.dataset.value;
                    
                    // Remove selected class from other buttons in same question
                    const questionButtons = container.querySelectorAll(`[data-question="${question}"]`);
                    questionButtons.forEach(btn => btn.classList.remove('selected'));
                    
                    // Add selected class to clicked button
                    e.target.classList.add('selected');
                    
                    // Store the answer
                    this.vulnerabilityAnswers[question] = parseInt(value);
                }
            });
        }
    }

    calculateVulnerability() {
        if (!this.vulnerabilityAnswers || Object.keys(this.vulnerabilityAnswers).length < 10) {
            alert('Proszę odpowiedzieć na wszystkie pytania (wybierz liczby od 1 do 5 dla każdego pytania).');
            return;
        }

        const total = Object.values(this.vulnerabilityAnswers).reduce((sum, val) => sum + val, 0);
        const resultDiv = document.getElementById('vulnerability-result');
        
        let interpretation = '';
        let advice = '';
        let statusClass = '';
        
        if (total <= 20) {
            interpretation = 'Niska podatność na wstyd';
            advice = 'Twoja podatność na wstyd jest niska. To dobra wiadomość! Prawdopodobnie radzisz sobie dobrze z błędami i nie pozwalasz im definiować Twojej wartości. Kontynuuj pracę nad samoakceptacją.';
            statusClass = 'status--success';
        } else if (total <= 35) {
            interpretation = 'Średnia podatność na wstyd';
            advice = 'Twoja podatność na wstyd jest przeciętna. Czasami może Cię to ograniczać, ale nie dominuje w Twoim życiu. Warto poznać techniki regulacji wstydu, aby lepiej sobie z nim radzić.';
            statusClass = 'status--info';
        } else {
            interpretation = 'Wysoka podatność na wstyd';
            advice = 'Twoja podatność na wstyd jest wysoka. Może to znacząco wpływać na Twoje codzienne funkcjonowanie i decyzje. Zdecydowanie warto poćwiczyć techniki regulacji wstydu i rozważyć wsparcie specjalisty.';
            statusClass = 'status--warning';
        }

        resultDiv.innerHTML = `
            <h4>Twój wynik: ${total}/50</h4>
            <div class="status ${statusClass}">${interpretation}</div>
            <p><strong>Interpretacja:</strong> ${advice}</p>
            <div style="margin-top: 16px;">
                <button class="btn btn--secondary" onclick="app.showSection('regulation')">
                    Przejdź do technik regulacji
                </button>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    // Fact Checking Tool
    analyzeJustification() {
        const situation = document.getElementById('situation-description').value.trim();
        const thoughts = document.getElementById('thoughts-description').value.trim();
        const checkboxes = ['q1', 'q2', 'q3', 'q4'].map(id => 
            document.getElementById(id).checked
        );

        if (!situation || !thoughts) {
            alert('Proszę wypełnić opis sytuacji i myśli.');
            return;
        }

        const redFlags = checkboxes.filter(checked => checked).length;
        const resultDiv = document.getElementById('justification-result');
        
        let analysis = '';
        let recommendation = '';

        if (redFlags >= 3) {
            analysis = 'Prawdopodobnie masz do czynienia z nieuzasadnionym wstydem lub poczuciem winy.';
            recommendation = 'Warto przepracować te przekonania używając technik regulacji emocji. Skup się na faktach, a nie na interpretacjach.';
        } else if (redFlags >= 1) {
            analysis = 'Twoja emocja może być częściowo uzasadniona, ale warto sprawdzić czy nie przesadzasz.';
            recommendation = 'Przeanalizuj sytuację jeszcze raz, oddzielając fakty od interpretacji. Zadaj sobie pytanie: "Co powiedziałbym przyjacielowi w tej sytuacji?"';
        } else {
            analysis = 'Twoja emocja wydaje się uzasadniona i może dostarczać ważnych informacji.';
            recommendation = 'Jeśli emocja jest proporcjonalna do sytuacji, warto jej wysłuchać i podjąć konstruktywne działania.';
        }

        resultDiv.innerHTML = `
            <h4>Analiza sytuacji</h4>
            <div class="status ${redFlags >= 2 ? 'status--warning' : 'status--success'}">${analysis}</div>
            <p><strong>Rekomendacja:</strong> ${recommendation}</p>
            <div style="margin-top: 16px;">
                <button class="btn btn--primary" onclick="app.showSection('regulation')">
                    Zobacz techniki regulacji
                </button>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    // Intensity Slider
    setupIntensitySlider() {
        const slider = document.getElementById('intensity-slider');
        const valueDisplay = document.getElementById('intensity-value');

        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
            });
        }
    }

    calculateIntensity() {
        const intensity = document.getElementById('intensity-slider').value;
        const emotionType = document.getElementById('emotion-type').value;
        const resultDiv = document.getElementById('intensity-result');

        let advice = '';
        let action = '';

        if (intensity <= 3) {
            advice = 'Niska intensywność - emocja jest łagodna i można ją bezpiecznie przeżyć.';
            action = 'Obserwuj emocję i wyciągnij z niej wnioski. Nie potrzebujesz specjalnych technik regulacji.';
        } else if (intensity <= 7) {
            advice = 'Średnia intensywność - emocja jest odczuwalna, ale można z nią pracować.';
            action = emotionType === 'shame' ? 
                'Użyj technik regulacji wstydu: nazwij emocję, oddychaj głęboko, praktykuj współczucie dla siebie.' :
                'Sprawdź czy możesz naprawić sytuację. Jeśli tak - podejmij działania. Jeśli nie - pracuj nad wybaczeniem sobie.';
        } else {
            advice = 'Wysoka intensywność - emocja może być przytłaczająca i paraliżująca.';
            action = 'Najpierw użyj technik regulacji, żeby obniżyć intensywność, dopiero potem analizuj czy emocja jest uzasadniona.';
        }

        resultDiv.innerHTML = `
            <h4>Ocena intensywności: ${intensity}/10</h4>
            <div class="status ${intensity > 7 ? 'status--warning' : intensity > 3 ? 'status--info' : 'status--success'}">${advice}</div>
            <p><strong>Zalecane działanie:</strong> ${action}</p>
        `;
        resultDiv.style.display = 'block';
    }

    // Technique Tabs
    setupTechniqueTabs() {
        const techButtons = document.querySelectorAll('.tech-tab-btn');
        techButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const techId = btn.dataset.tech;
                this.showTechnique(techId);
            });
        });
    }

    showTechnique(techId) {
        // Hide all technique contents
        const techContents = document.querySelectorAll('.tech-content');
        techContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show target technique
        const targetContent = document.getElementById(`${techId}-techniques`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Update technique buttons
        const techButtons = document.querySelectorAll('.tech-tab-btn');
        techButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tech === techId) {
                btn.classList.add('active');
            }
        });
    }

    // Modal Management
    setupModals() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Exercise Functions
    openJournal() {
        this.openModal('journal-modal');
    }

    openFactCheck() {
        this.showSection('assessment');
        this.showTab('justified', document.getElementById('assessment'));
    }

    generateAffirmation() {
        const affirmations = [
            "Jestem człowiekiem i mam prawo do błędów",
            "Mogę się uczyć i rosnąć dzięki swoim doświadczeniom",
            "Zasługuję na współczucie, zwłaszcza od siebie",
            "Moja wartość nie zależy od moich błędów",
            "Jestem wystarczająco dobry/a taki/a, jaki/a jestem",
            "Mogę wybaczać sobie i innym",
            "Każdy dzień to nowa szansa na lepsze wybory",
            "Jestem odpowiedzialny/a za swoje czyny, ale to nie definiuje mnie jako osoby",
            "Mogę odczuwać trudne emocje i nadal być w porządku",
            "Mam siłę, żeby poradzić sobie z wyzwaniami"
        ];

        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        const affirmationDisplay = document.getElementById('affirmation-text');
        
        if (affirmationDisplay) {
            affirmationDisplay.textContent = randomAffirmation;
        }
        
        this.openModal('affirmation-modal');
    }

    openFriendTalk() {
        this.openModal('friend-modal');
        // Reset conversation
        const situationField = document.getElementById('friend-situation');
        const responseDiv = document.getElementById('friend-response');
        if (situationField) situationField.value = '';
        if (responseDiv) responseDiv.style.display = 'none';
    }

    friendResponse() {
        const situation = document.getElementById('friend-situation').value.trim();
        if (!situation) {
            alert('Proszę opisać swoją sytuację.');
            return;
        }

        const responses = [
            `Dziękuję za podzielenie się tym ze mną. Widzę, że to dla Ciebie trudne. Pamiętaj, że wszyscy popełniamy błędy - to część bycia człowiekiem.`,
            `Rozumiem, że się tym martwisz. Ale czy nie jesteś za surowy/a dla siebie? Co powiedziałbyś/abyś komuś innemu w takiej sytuacji?`,
            `To brzmi naprawdę trudno. Ale widzę w Tobie siłę - skoro opowiadasz mi o tym, znaczy że chcesz coś z tym zrobić. To już duży krok.`,
            `Każdy zasługuje na drugie szanse, włączając Ciebie. Ta sytuacja nie definiuje Cię jako osoby. Jesteś znacznie więcej niż jeden błąd.`,
            `Widzę, że bardzo się tym przejmujesz, co pokazuje, że jesteś dobrą osobą z silnymi wartościami. Teraz pytanie: co możesz zrobić konstruktywnego?`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseDiv = document.getElementById('friend-response');
        
        if (responseDiv) {
            responseDiv.innerHTML = `
                <div class="conversation-step">
                    <p><strong>Przyjaciel:</strong> ${randomResponse}</p>
                    <p><strong>Przyjaciel:</strong> Jak się teraz czujesz? Co myślisz o tej sytuacji po naszej rozmowie?</p>
                    <textarea class="form-control" placeholder="Odpowiedz przyjacielowi..."></textarea>
                    <div style="margin-top: 8px;">
                        <button class="btn btn--secondary" onclick="app.closeModal('friend-modal')">Zakończ rozmowę</button>
                    </div>
                </div>
            `;
            responseDiv.style.display = 'block';
        }
    }

    // Audio Players (Simulated)
    setupAudioPlayers() {
        const audioData = {
            'meditation': {
                duration: 600, // 10 minutes
                title: 'Medytacja uważności na wstyd'
            },
            'breathing': {
                duration: 300, // 5 minutes
                title: 'Ćwiczenie oddechowe 4-7-8'
            },
            'guilt-release': {
                duration: 480, // 8 minutes
                title: 'Relaksacja dla poczucia winy'
            },
            'affirmations': {
                duration: 360, // 6 minutes
                title: 'Afirmacje współczucia'
            }
        };

        Object.keys(audioData).forEach(audioId => {
            this.audioPlayers[audioId] = {
                ...audioData[audioId],
                isPlaying: false,
                currentTime: 0,
                interval: null
            };
        });
    }

    playAudio(audioId) {
        const audio = this.audioPlayers[audioId];
        if (!audio) return;

        const button = document.querySelector(`button[onclick="playAudio('${audioId}')"]`);
        const progressBar = document.getElementById(`${audioId}-progress`);

        if (!audio.isPlaying) {
            // Start playing
            audio.isPlaying = true;
            if (button) {
                button.textContent = '⏸️ Zatrzymaj';
                button.classList.add('playing');
            }

            // Simulate audio progress
            audio.interval = setInterval(() => {
                audio.currentTime += 1;
                const progress = (audio.currentTime / audio.duration) * 100;
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }

                // Update time display
                if (button) {
                    const timeDisplay = button.parentElement.querySelector('.audio-time');
                    if (timeDisplay) {
                        const remaining = audio.duration - audio.currentTime;
                        const minutes = Math.floor(remaining / 60);
                        const seconds = remaining % 60;
                        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                }

                // End when duration reached
                if (audio.currentTime >= audio.duration) {
                    this.stopAudio(audioId);
                }
            }, 1000);

            // Show success message
            this.showAudioMessage(audioId, 'Odtwarzanie rozpoczęte. Znajdź spokojne miejsce i pozwól sobie na pełne doświadczenie ćwiczenia.');

        } else {
            // Stop playing
            this.stopAudio(audioId);
        }
    }

    stopAudio(audioId) {
        const audio = this.audioPlayers[audioId];
        if (!audio) return;

        const button = document.querySelector(`button[onclick="playAudio('${audioId}')"]`);
        const progressBar = document.getElementById(`${audioId}-progress`);

        audio.isPlaying = false;
        audio.currentTime = 0;
        
        if (button) {
            button.textContent = '▶️ Odtwórz';
            button.classList.remove('playing');
        }

        if (audio.interval) {
            clearInterval(audio.interval);
            audio.interval = null;
        }

        if (progressBar) {
            progressBar.style.width = '0%';
        }

        // Reset time display
        if (button) {
            const timeDisplay = button.parentElement.querySelector('.audio-time');
            if (timeDisplay) {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = audio.duration % 60;
                timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }

    showAudioMessage(audioId, message) {
        const button = document.querySelector(`button[onclick="playAudio('${audioId}')"]`);
        if (!button) return;

        const audioItem = button.closest('.audio-item');
        if (!audioItem) return;

        let messageDiv = audioItem.querySelector('.audio-message');
        
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'audio-message success-message';
            audioItem.querySelector('.card__body').appendChild(messageDiv);
        }
        
        messageDiv.textContent = message;
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    // Form Handling
    setupForms() {
        const journalForm = document.getElementById('journal-form');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveJournalEntry(new FormData(journalForm));
            });
        }
    }

    saveJournalEntry(formData) {
        const entry = {
            date: new Date().toLocaleDateString('pl-PL'),
            situation: formData.get('situation'),
            trigger: formData.get('trigger'),
            body: formData.get('body'),
            thoughts: formData.get('thoughts'),
            reaction: formData.get('reaction'),
            friend: formData.get('friend'),
            intensity: formData.get('intensity')
        };

        this.journalEntries.push(entry);
        
        // Show success message
        const form = document.getElementById('journal-form');
        let successMessage = form.querySelector('.success-message');
        
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            form.appendChild(successMessage);
        }
        
        successMessage.textContent = 'Wpis został zapisany! Regularne prowadzenie dziennika pomoże Ci lepiej zrozumieć swoje wzorce.';
        
        // Clear form
        form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage && successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
        
        // Close modal after 2 seconds
        setTimeout(() => {
            this.closeModal('journal-modal');
        }, 2000);
    }
}

// Global functions for onclick handlers
function showSection(sectionId) {
    if (window.app) {
        window.app.showSection(sectionId);
    }
}

function calculateVulnerability() {
    if (window.app) {
        window.app.calculateVulnerability();
    }
}

function analyzeJustification() {
    if (window.app) {
        window.app.analyzeJustification();
    }
}

function calculateIntensity() {
    if (window.app) {
        window.app.calculateIntensity();
    }
}

function openJournal() {
    if (window.app) {
        window.app.openJournal();
    }
}

function openFactCheck() {
    if (window.app) {
        window.app.openFactCheck();
    }
}

function generateAffirmation() {
    if (window.app) {
        window.app.generateAffirmation();
    }
}

function openFriendTalk() {
    if (window.app) {
        window.app.openFriendTalk();
    }
}

function friendResponse() {
    if (window.app) {
        window.app.friendResponse();
    }
}

function playAudio(audioId) {
    if (window.app) {
        window.app.playAudio(audioId);
    }
}

function closeModal(modalId) {
    if (window.app) {
        window.app.closeModal(modalId);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    window.app = new EmotionApp();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                openModal.style.display = 'none';
            }
        }
    });

    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('shown', function() {
            const firstFocusable = modal.querySelector(focusableElements);
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    });
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionApp;
}