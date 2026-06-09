(function () {
                    const reveals = Array.from(document.querySelectorAll('.reveal'));
                    if (!('IntersectionObserver' in window) || reveals.length === 0) {
                        // Fallback: reveal immediately and set counts
                        reveals.forEach(r => r.classList.add('visible'));
                        document.querySelectorAll('.count-value').forEach(el => el.textContent = '+' + el.dataset.target);
                        return;
                    }

                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (!entry.isIntersecting) return;
                            const el = entry.target;
                            // apply optional delay
                            const delay = parseInt(el.getAttribute('data-delay')) || 0;
                            el.style.transitionDelay = `${delay}ms`;
                            el.classList.add('visible');

                            // if there's a counter inside, animate it once
                            const counter = el.querySelector && el.querySelector('.count-value');
                            if (counter && !counter.dataset.animated) {
                                animateCount(counter, parseInt(counter.dataset.target) || 0);
                                counter.dataset.animated = '1';
                            }

                            // stop observing once revealed
                            obs.unobserve(el);
                        });
                    }, { threshold: 0.18 });

                    reveals.forEach(r => observer.observe(r));

                    function animateCount(el, target) {
                        const duration = 1400;
                        const start = performance.now();
                        function step(now) {
                            const p = Math.min((now - start) / duration, 1);
                            const eased = easeOutCubic(p);
                            const value = Math.floor(eased * target);
                            el.textContent = value;
                            if (p < 1) requestAnimationFrame(step);
                            else el.textContent = target;
                        }
                        // show plus sign by updating sibling if present
                        const plus = el.parentElement && el.parentElement.querySelector('.count-plus');
                        if (plus) {
                            // ensure plus positioned consistently during animation
                        }
                        requestAnimationFrame(step);
                    }

                    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
                })();

                (function () {
                    const form = document.querySelector('.chatbot-form');
                    const messagesEl = document.querySelector('.chatbot-messages');
                    if (!form || !messagesEl) return;

                    const responses = [
                        { pattern: /hola|buenas|buenos dias|buenas tardes|buenas noches/i, reply: 'Hola 👋, soy tu asistente. ¿En qué puedo ayudarte hoy?' },
                        { pattern: /afiliad|afiliar|afiliación/i, reply: 'Para afiliarte puedes ir a la sección de contacto o preguntarme por los requisitos.' },
                        { pattern: /servicios|beneficios|convenios/i, reply: 'Ofrecemos asesoría jurídica, salud, actividades recreativas y convenios especiales.' },
                        { pattern: /contacto|teléfono|correo|ubicación/i, reply: 'Puedes ver los datos de contacto en la sección de información de la empresa.' },
                        { pattern: /horario|actividades|eventos/i, reply: 'Revisa la tabla de actividades próximas en la misma página para ver los horarios y lugares.' }
                    ];

                    function addMessage(text, type) {
                        const message = document.createElement('div');
                        message.className = `chatbot-message ${type}`;
                        message.textContent = text;
                        messagesEl.appendChild(message);
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    }

                    function getReply(text) {
                        const match = responses.find(item => item.pattern.test(text));
                        return match ? match.reply : 'Lo siento, aún estoy aprendiendo. Prueba con: “hola”, “servicios”, “afiliación” o “contacto”.';
                    }

                    form.addEventListener('submit', event => {
                        event.preventDefault();
                        const input = form.querySelector('input[name="message"]');
                        const value = input.value.trim();
                        if (!value) return;

                        addMessage(value, 'user');
                        input.value = '';

                        setTimeout(() => {
                            addMessage(getReply(value), 'bot');
                        }, 450);
                    });

                    addMessage('Hola! Escribe tu pregunta y te respondo con ejemplos básicos.', 'bot');

                    const toggleButton = document.querySelector('.chatbot-toggle');
                    const panel = document.querySelector('.chatbot-panel');
                    const closeButton = document.querySelector('.chatbot-close');

                    function openChat() {
                        if (!panel) return;
                        panel.classList.add('open');
                        panel.setAttribute('aria-hidden', 'false');
                        const input = panel.querySelector('input[name="message"]');
                        input?.focus();
                    }

                    function closeChat() {
                        if (!panel) return;
                        panel.classList.remove('open');
                        panel.setAttribute('aria-hidden', 'true');
                    }

                    toggleButton?.addEventListener('click', openChat);
                    closeButton?.addEventListener('click', closeChat);
                    document.addEventListener('keydown', event => {
                        if (event.key === 'Escape' && panel?.classList.contains('open')) {
                            closeChat();
                        }
                    });
                })();