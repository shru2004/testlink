// ===============================================
// VALENTINE'S QUEST APPLICATION
// ===============================================

class ValentineQuest {
    constructor() {
        this.currentTask = 0;
        this.totalTasks = 5;
        this.floatingInterval = null;
        this.typingInterval = null;
    }
    
    init() {
        this.attachEventListeners();
        this.startFloatingAnimation();
    }
    
    // ===============================================
    // FLOATING ELEMENTS
    // ===============================================
    createFloatingElements() {
        const container = document.getElementById('floating-elements');
        if (!container) return;
        
        const elements = ['heart', 'rose', 'sparkle'];
        
        this.floatingInterval = setInterval(() => {
            const element = document.createElement('div');
            element.classList.add('floating-element', `floating-${elements[Math.floor(Math.random() * elements.length)]}`);
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDuration = (Math.random() * 3 + 4) + 's';
            
            container.appendChild(element);
            setTimeout(() => element.remove(), 8000);
        }, 800);
    }
    
    startFloatingAnimation() {
        this.createFloatingElements();
    }
    
    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    attachEventListeners() {
        // Submit buttons
        document.querySelectorAll('.submit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.checkAnswer(e.target.closest('.task'));
            });
        });
        
        // Enter key
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkAnswer(e.target.closest('.task'));
            });
        });
        
        // Hint buttons
        document.querySelectorAll('.hint-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.nextElementSibling.classList.toggle('hidden');
            });
        });
        
        // Valentine buttons
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');
        if (yesBtn) yesBtn.addEventListener('click', () => this.showCelebration());
        if (noBtn) {
            noBtn.addEventListener('mousemove', (e) => {
                const rect = noBtn.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const deltaX = btnCenterX - mouseX;
                const deltaY = btnCenterY - mouseY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 150) {
                    const moveX = (deltaX / distance) * 200;
                    const moveY = (deltaY / distance) * 200;
                    
                    noBtn.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX / 10}deg)`;
                    noBtn.style.transition = 'none';
                }
            });
            
            noBtn.addEventListener('mouseleave', () => {
                noBtn.style.transition = 'all 0.3s ease';
            });
        }
    }
    
    // ===============================================
    // QUEST FLOW
    // ===============================================
    startQuest() {
        this.showPage('tasks-container');
        this.showTask(1);
    }
    
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const page = document.getElementById(pageId);
        if (page) page.classList.add('active');
    }
    
    showTask(taskNumber) {
        document.querySelectorAll('.task').forEach(task => task.classList.add('hidden'));
        const task = document.getElementById(`task-${taskNumber}`);
        if (task) {
            task.classList.remove('hidden');
            this.currentTask = taskNumber;
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const fill = document.querySelector('.progress-fill');
        const text = document.querySelector('.progress-text');
        if (fill) fill.style.width = (this.currentTask / this.totalTasks) * 100 + '%';
        if (text) text.textContent = `Task ${this.currentTask} of ${this.totalTasks}`;
    }
    
    // ===============================================
    // ANSWER CHECKING
    // ===============================================
    checkAnswer(task) {
        const input = task.querySelector('.answer-input');
        const feedback = task.querySelector('.feedback');
        const expected = input.getAttribute('data-answer').toLowerCase().trim();
        const answer = input.value.trim().toLowerCase();
        
        feedback.classList.remove('hidden', 'success', 'error');
        
        // Flexible matching - normalize spaces and make case-insensitive
        // Remove all spaces for comparison to allow any spacing variation
        const normalizedAnswer = answer.replace(/\s+/g, '');
        const normalizedExpected = expected.replace(/\s+/g, '');
        const isCorrect = normalizedAnswer === normalizedExpected;
        
        if (isCorrect) {
            feedback.classList.add('success');
            feedback.textContent = '💕 Perfect! Your heart remembers... ✨';
            
            this.createSuccessAnimation(task);
            
            input.disabled = true;
            const btn = task.querySelector('.submit-btn');
            btn.disabled = true;
            btn.textContent = 'Completed 💖';
            
            setTimeout(() => {
                if (this.currentTask < this.totalTasks) {
                    this.showTask(this.currentTask + 1);
                } else {
                    this.completeQuest();
                }
            }, 2500);
        } else {
            feedback.classList.add('error');
            const messages = [
                'Hmm... think with your heart 💭',
                'Your heart knows the answer 💕',
                'Feel the memory, don\'t think it 🌸',
                'Close your eyes and remember us ✨'
            ];
            feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
            feedback.style.animation = 'shake 0.5s';
            setTimeout(() => feedback.style.animation = '', 500);
        }
    }
    
    // ===============================================
    // ANIMATIONS
    // ===============================================
    createSuccessAnimation(task) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💖';
                heart.style.cssText = 'position:absolute;font-size:25px;pointer-events:none;z-index:1000';
                
                const rect = task.getBoundingClientRect();
                heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
                heart.style.top = rect.top + 'px';
                
                document.body.appendChild(heart);
                
                heart.animate([
                    { transform: 'translateY(0) scale(0)', opacity: 0 },
                    { transform: 'translateY(-100px) scale(1)', opacity: 1 },
                    { transform: 'translateY(-200px) scale(0)', opacity: 0 }
                ], { duration: 2000, easing: 'ease-out' }).onfinish = () => heart.remove();
            }, i * 200);
        }
    }
    
    // ===============================================
    // VALENTINE PAGE
    // ===============================================
    completeQuest() {
        this.showPage('valentine-page');
        this.typeMessage();
    }
    
    typeMessage() {
        const msg = "After every place, every memory, every version of us... there's just one thing left to ask.";
        const el = document.getElementById('typed-message');
        if (!el) return;
        
        let i = 0;
        el.textContent = '';
        this.typingInterval = setInterval(() => {
            if (i < msg.length) {
                el.textContent += msg[i++];
            } else {
                clearInterval(this.typingInterval);
                setTimeout(() => {
                    const card = document.querySelector('.valentine-card');
                    if (card) {
                        card.classList.remove('hidden');
                        card.style.animation = 'cardAppear 1s ease-out';
                    }
                }, 1000);
            }
        }, 80);
    }
    
    // ===============================================
    // CELEBRATION
    // ===============================================
    showCelebration() {
        this.showPage('celebration-page');
        
        // Confetti
        const colors = ['#ff6b6b', '#4caf50', '#2196f3', '#ff9800', '#9c27b0'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const c = document.createElement('div');
                c.className = 'confetti';
                c.style.background = colors[Math.floor(Math.random() * colors.length)];
                c.style.left = Math.random() * 100 + '%';
                c.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(c);
                setTimeout(() => c.remove(), 5000);
            }, i * 100);
        }
        
        // Heart burst
        const burst = document.querySelector('.heart-burst');
        if (burst) {
            const hearts = ['💖', '💕', '💘', '💗', '💝'];
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'burst-heart';
                    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                    
                    const angle = (i / 12) * 360;
                    const x = Math.cos(angle * Math.PI / 180) * 150;
                    const y = Math.sin(angle * Math.PI / 180) * 150;
                    
                    h.style.setProperty('--x', x + 'px');
                    h.style.setProperty('--y', y + 'px');
                    
                    burst.appendChild(h);
                    setTimeout(() => h.remove(), 2000);
                }, i * 150);
            }
        }
    }
    
    cleanup() {
        if (this.floatingInterval) clearInterval(this.floatingInterval);
        if (this.typingInterval) clearInterval(this.typingInterval);
    }
}

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    const quest = new ValentineQuest();
    window.valentineQuest = quest;
    quest.init();
    
    // Start button
    const btn = document.getElementById('start-quest');
    if (btn) {
        btn.addEventListener('click', () => quest.startQuest());
    }
    
    // Mouse sparkles
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            const s = document.createElement('div');
            s.textContent = '✨';
            s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;font-size:12px;z-index:999`;
            document.body.appendChild(s);
            s.animate([
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0) translateY(-20px)' }
            ], { duration: 1000 }).onfinish = () => s.remove();
        }
    });
});
