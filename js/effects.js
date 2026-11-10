/**
 * 视觉效果脚本
 * 功能：粒子网络背景、滚动入场动画、卡片聚光、打字机标题、技术栈跑马灯
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 标记 JS 已启用，避免禁用脚本时内容被隐藏
    document.documentElement.classList.add('js-reveal');

    function isLightTheme() {
        return document.body.getAttribute('data-theme') === 'light';
    }

    /* ============ 粒子网络背景 ============ */
    function initCanvas() {
        var canvas = document.getElementById('bg-canvas');
        if (!canvas || reduceMotion) return;

        var ctx = canvas.getContext('2d');
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var particles = [];
        var width = 0;
        var height = 0;
        var mouse = { x: null, y: null };
        var rafId = null;

        var LINK_DIST = 132;
        var MOUSE_DIST = 170;

        function build() {
            var count = Math.min(88, Math.round((width * height) / 19000));
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.32,
                    vy: (Math.random() - 0.5) * 0.32,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }

        function resize() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            build();
        }

        function draw() {
            var light = isLightTheme();
            var nodeColor = light ? '8, 145, 178' : '103, 232, 249';
            var linkColor = light ? '8, 145, 178' : '120, 180, 255';

            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + nodeColor + ', 0.6)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < LINK_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(' + linkColor + ', ' + (0.18 * (1 - dist / LINK_DIST)).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    var mdx = p.x - mouse.x;
                    var mdy = p.y - mouse.y;
                    var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < MOUSE_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = 'rgba(' + nodeColor + ', ' + (0.32 * (1 - mdist / MOUSE_DIST)).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            rafId = window.requestAnimationFrame(draw);
        }

        function start() {
            if (rafId === null) draw();
        }

        function stop() {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('pointermove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });
        window.addEventListener('pointerleave', function () {
            mouse.x = null;
            mouse.y = null;
        });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });

        resize();
        start();
    }

    /* ============ 滚动入场 ============ */
    var revealObserver = null;

    function ensureObserver() {
        if (revealObserver || !('IntersectionObserver' in window)) return;
        revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    }

    function observe(el, delay) {
        if (!el || el.dataset.revealBound === '1') return;
        el.dataset.revealBound = '1';
        el.classList.add('reveal');
        if (delay) el.style.setProperty('--delay', delay + 's');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            el.classList.add('is-visible');
            return;
        }
        ensureObserver();
        revealObserver.observe(el);
    }

    function observeCards(scope, stagger) {
        var cards = (scope || document).querySelectorAll('.post-card');
        Array.prototype.forEach.call(cards, function (card, i) {
            observe(card, stagger === false ? 0 : Math.min(i, 8) * 0.06);
        });
    }

    /* ============ 卡片聚光 ============ */
    function initSpotlight() {
        document.addEventListener('pointermove', function (e) {
            var card = e.target.closest ? e.target.closest('.post-card') : null;
            if (!card) return;
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
        }, { passive: true });
    }

    /* ============ 头部滚动状态 ============ */
    function initHeader() {
        var header = document.querySelector('header');
        if (!header) return;
        var update = function () {
            header.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ============ 打字机效果 ============ */
    function initTypewriter() {
        var el = document.querySelector('[data-typewriter]');
        if (!el) return;

        var phrases = (el.getAttribute('data-typewriter') || el.textContent || '')
            .split('|')
            .map(function (s) { return s.trim(); })
            .filter(Boolean);

        if (!phrases.length) return;

        if (reduceMotion) {
            el.textContent = phrases[0];
            return;
        }

        var textNode = document.createElement('span');
        textNode.className = 'type-text';
        var caret = document.createElement('span');
        caret.className = 'type-caret';
        el.textContent = '';
        el.appendChild(textNode);
        el.appendChild(caret);

        var phraseIndex = 0;
        var charIndex = 0;
        var deleting = false;

        function tick() {
            var phrase = phrases[phraseIndex];

            if (!deleting) {
                charIndex++;
                textNode.textContent = phrase.slice(0, charIndex);
                if (charIndex >= phrase.length) {
                    deleting = true;
                    return window.setTimeout(tick, 2200);
                }
                return window.setTimeout(tick, 75 + Math.random() * 55);
            }

            charIndex--;
            textNode.textContent = phrase.slice(0, charIndex);
            if (charIndex <= 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                return window.setTimeout(tick, 420);
            }
            return window.setTimeout(tick, 32);
        }

        tick();
    }

    /* ============ 技术栈跑马灯（复制内容实现无缝循环） ============ */
    function initMarquee() {
        var track = document.querySelector('.tech-track');
        if (!track || track.dataset.cloned === '1') return;
        var children = Array.prototype.slice.call(track.children);
        children.forEach(function (child) {
            track.appendChild(child.cloneNode(true));
        });
        track.dataset.cloned = '1';
    }

    /* ============ 数字滚动 ============ */
    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
        if (isNaN(target)) return;
        if (reduceMotion) {
            el.textContent = String(target);
            return;
        }
        var start = null;
        var duration = 900;

        function step(timestamp) {
            if (start === null) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);
    }

    window.animateCount = animateCount;

    /* ============ 初始化 ============ */
    document.addEventListener('DOMContentLoaded', function () {
        initCanvas();
        initSpotlight();
        initHeader();
        initTypewriter();
        initMarquee();

        var revealTargets = document.querySelectorAll('.reveal');
        Array.prototype.forEach.call(revealTargets, function (el) {
            observe(el, 0);
        });

        observeCards(document, true);

        // 动态渲染的文章卡片（筛选、加载等）也要有入场动画
        if ('MutationObserver' in window) {
            var mo = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    Array.prototype.forEach.call(mutation.addedNodes, function (node) {
                        if (node.nodeType !== 1) return;
                        if (node.classList && node.classList.contains('post-card')) {
                            observe(node, 0);
                        }
                        if (node.querySelectorAll) {
                            observeCards(node, true);
                        }
                    });
                });
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    });
})();
