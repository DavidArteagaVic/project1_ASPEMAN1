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