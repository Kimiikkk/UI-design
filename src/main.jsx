import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function SphereField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const interactionSurface = canvas.parentElement;
    const context = canvas.getContext('2d', { alpha: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let balls = [];
    let frame = 0;
    let previousTime = 0;
    const pointer = {
      x: -1000,
      y: -1000,
      ballX: -1000,
      ballY: -1000,
      active: false,
      ballActive: false,
    };
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const createBalls = () => {
      const columns = Math.max(4, Math.ceil(width / 68));
      const layerCount = 5;
      const count = Math.min(130, Math.max(20, columns * layerCount));
      const columnGap = width / columns;
      balls = Array.from({ length: count }, (_, index) => {
        const layer = Math.floor(index / columns);
        const column = index % columns;
        const depthScale = 1 - layer * 0.075;
        const radius = (34 + Math.random() * 5) * depthScale;
        const stagger = layer % 2 ? columnGap * 0.5 : 0;
        const floor = height - radius - layer * 33;
        return {
          x: Math.min(width - radius, Math.max(radius, (column + 0.5) * columnGap + stagger + (Math.random() - 0.5) * 5)),
          y: floor - Math.random() * 5,
          floor,
          layer,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.3,
          radius,
          seed: Math.random(),
        };
      });
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr());
      canvas.height = Math.round(height * dpr());
      context.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      createBalls();
      draw();
    };

    const drawBall = (ball) => {
      const { x, y, radius, seed } = ball;
      context.save();
      const lightDx = pointer.ballX - x;
      const lightDy = pointer.ballY - y;
      const lightDistance = Math.hypot(lightDx, lightDy);
      const proximity = Math.max(0, 1 - (lightDistance / 180) ** 2);
      const light = pointer.ballActive
        ? proximity * (1 - ball.layer * 0.04)
        : 0;
      const lightAngle = Math.atan2(lightDy, lightDx);
      const defaultX = x - radius * 0.38;
      const defaultY = y - radius * 0.43;
      const lightX = x + Math.cos(lightAngle) * radius * 0.44;
      const lightY = y + Math.sin(lightAngle) * radius * 0.44;
      const highlightX = defaultX + (lightX - defaultX) * light;
      const highlightY = defaultY + (lightY - defaultY) * light;
      const glow = context.createRadialGradient(
        highlightX, highlightY, radius * 0.04,
        x, y, radius * 1.04,
      );
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.24, seed > 0.77 ? '#ffffff' : '#fafafa');
      glow.addColorStop(0.58, '#ededed');
      glow.addColorStop(0.84, '#d4d4d4');
      glow.addColorStop(1, '#bcbcbc');

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = glow;
      context.shadowColor = 'rgba(255,255,255,.08)';
      context.shadowBlur = 4;
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.ellipse(
        x - radius * 0.33 + (lightX - (x - radius * 0.33)) * light,
        y - radius * 0.42 + (lightY - (y - radius * 0.42)) * light,
        radius * 0.17,
        radius * 0.085,
        light ? lightAngle : -0.62,
        0,
        Math.PI * 2,
      );
      context.fillStyle = 'rgba(255,255,255,.52)';
      context.fill();

      if (light > 0.03 && lightDistance > 0) {
        const spotX = x + (lightDx / lightDistance) * radius * 0.55;
        const spotY = y + (lightDy / lightDistance) * radius * 0.55;
        const reflection = context.createRadialGradient(spotX, spotY, 0, spotX, spotY, radius * 0.92);
        reflection.addColorStop(0, `rgba(255,255,255,${0.82 * light})`);
        reflection.addColorStop(0.3, `rgba(255,255,255,${0.42 * light})`);
        reflection.addColorStop(1, 'rgba(255,255,255,0)');
        context.save();
        context.beginPath();
        context.arc(x, y, radius * 0.98, 0, Math.PI * 2);
        context.clip();
        context.fillStyle = reflection;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        context.beginPath();
        context.ellipse(spotX, spotY, radius * 0.15, radius * 0.07, lightAngle, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${0.94 * light})`;
        context.fill();
        context.restore();
      }

      if (light > 0.015) {
        const auraRadius = radius * 1.55;
        const aura = context.createRadialGradient(x, y, radius * 0.98, x, y, auraRadius);
        aura.addColorStop(0, 'rgba(255,255,255,0)');
        aura.addColorStop(0.08, `rgba(255,255,255,${0.48 * light})`);
        aura.addColorStop(0.34, `rgba(255,255,255,${0.3 * light})`);
        aura.addColorStop(0.68, `rgba(255,255,255,${0.11 * light})`);
        aura.addColorStop(1, 'rgba(255,255,255,0)');
        context.beginPath();
        context.arc(x, y, auraRadius, 0, Math.PI * 2);
        context.fillStyle = aura;
        context.fill();
      }
      context.restore();
    };

    const drawSunCore = () => {
      const radius = 26;
      const { ballX: x, ballY: y } = pointer;
      const surface = context.createRadialGradient(
        x - radius * 0.35, y - radius * 0.4, radius * 0.04,
        x, y, radius,
      );
      surface.addColorStop(0, '#ffffff');
      surface.addColorStop(0.54, '#ffffff');
      surface.addColorStop(0.84, '#f5f5f5');
      surface.addColorStop(0.97, '#e6e6e6');
      surface.addColorStop(1, '#ffffff');

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = surface;
      context.fill();
      context.beginPath();
      context.ellipse(x - radius * 0.32, y - radius * 0.38, radius * 0.17, radius * 0.08, -0.6, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255,255,255,.75)';
      context.fill();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      balls.slice().sort((a, b) => b.layer - a.layer || a.y - b.y).forEach(drawBall);
      if (pointer.ballActive) drawSunCore();
    };

    const updatePointerProximity = () => {
      if (pointer.active) {
        const nearestBall = balls.reduce((nearest, ball) => {
          return Math.min(nearest, Math.hypot(ball.x - pointer.x, ball.y - pointer.y));
        }, Infinity);
        pointer.ballActive = nearestBall < 155;
      } else {
        pointer.ballActive = false;
      }
      canvas.classList.toggle('sphere-field--cursor-ball', pointer.ballActive);
    };

    const animate = (time) => {
      const step = Math.min((time - (previousTime || time)) / 16.67, 1.6);
      previousTime = time;
      if (pointer.active) {
        updatePointerProximity();
        pointer.ballX += (pointer.x - pointer.ballX) * Math.min(1, 0.38 * step);
        pointer.ballY += (pointer.y - pointer.ballY) * Math.min(1, 0.38 * step);
      } else {
        updatePointerProximity();
      }

      for (let i = 0; i < balls.length; i += 1) {
        const ball = balls[i];
        ball.vy += 0.115 * step;

        if (pointer.active) {
          const dx = ball.x - pointer.x;
          const dy = ball.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / 155) * (1 - ball.layer * 0.08);
          if (influence && distance > 0) {
            const force = influence * 1.65;
            ball.vx += (dx / distance) * force * step;
            ball.vy += (dy / distance) * force * step;
          }
        }

        for (let j = i + 1; j < balls.length; j += 1) {
          const other = balls[j];
          if (ball.layer !== other.layer) continue;
          const dx = other.x - ball.x;
          const dy = other.y - ball.y;
          const distance = Math.hypot(dx, dy);
          const minDistance = ball.radius + other.radius;
          if (distance > 0 && distance < minDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = (minDistance - distance) * 0.5;
            ball.x -= nx * overlap;
            ball.y -= ny * overlap;
            other.x += nx * overlap;
            other.y += ny * overlap;
            const relative = (other.vx - ball.vx) * nx + (other.vy - ball.vy) * ny;
            if (relative < 0) {
              const impulse = relative * 0.72;
              ball.vx += impulse * nx;
              ball.vy += impulse * ny;
              other.vx -= impulse * nx;
              other.vy -= impulse * ny;
            }
          }
        }

        ball.vx *= 0.992;
        ball.vy *= 0.994;
        ball.x += ball.vx * step;
        ball.y += ball.vy * step;
        if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx = Math.abs(ball.vx) * 0.68; }
        if (ball.x > width - ball.radius) { ball.x = width - ball.radius; ball.vx = -Math.abs(ball.vx) * 0.68; }
        if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy = Math.abs(ball.vy) * 0.65; }
        if (ball.y > ball.floor) { ball.y = ball.floor; ball.vy = -Math.abs(ball.vy) * 0.48; }
      }
      draw();
      frame = window.requestAnimationFrame(animate);
    };

    const setPointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      if (
        event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom
      ) {
        clearPointer();
        return;
      }
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      if (!pointer.active) {
        pointer.ballX = pointer.x;
        pointer.ballY = pointer.y;
      }
      pointer.active = true;
      updatePointerProximity();
      if (reducedMotion.matches) {
        pointer.ballX = pointer.x;
        pointer.ballY = pointer.y;
        draw();
      }
    };
    const clearPointer = () => {
      pointer.active = false;
      updatePointerProximity();
      if (reducedMotion.matches) draw();
    };

    resize();
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    interactionSurface.addEventListener('pointermove', setPointer);
    interactionSurface.addEventListener('pointerleave', clearPointer);
    interactionSurface.addEventListener('pointerdown', setPointer);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frame);
      interactionSurface.removeEventListener('pointermove', setPointer);
      interactionSurface.removeEventListener('pointerleave', clearPointer);
      interactionSurface.removeEventListener('pointerdown', setPointer);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="sphere-field" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const introRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return undefined;
    const handleMove = (event) => {
      const bounds = intro.getBoundingClientRect();
      intro.style.setProperty('--glitch-x', `${event.clientX - bounds.left}px`);
      intro.style.setProperty('--glitch-y', `${event.clientY - bounds.top}px`);
      intro.classList.add('intro-wrap--active');
    };
    const handleLeave = () => intro.classList.remove('intro-wrap--active');
    intro.addEventListener('pointermove', handleMove);
    intro.addEventListener('pointerleave', handleLeave);
    return () => {
      intro.removeEventListener('pointermove', handleMove);
      intro.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  const introText = 'At Empire UI, we don’t just build tech — we craft experiences. Every device is engineered with precision, purpose, and a deep understanding of how technology fits into your life. Our mission is simple: empower the next generation with tools that look great, perform better, and last longer.';
  const morseMap = {
    a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....',
    i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.',
    q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
    y: '-.--', z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  };
  const introMorse = introText.toLowerCase().split('').map((character) => {
    if (character === ' ') return ' / ';
    return morseMap[character] || '';
  }).filter(Boolean).join(' ');

  const trackCardPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
  };
  const highlightPage = () => pageRef.current?.classList.add('page-frame--feature-focus');
  const clearPageHighlight = () => pageRef.current?.classList.remove('page-frame--feature-focus');
  const cards = [
    { id: 'backgrounds', label: 'Backgrounds', className: 'feature-card--backgrounds', art: 'rings' },
    { id: 'textures', label: 'Textures', className: 'feature-card--textures', art: 'texture' },
    { id: 'components', label: 'Components', className: 'feature-card--components', art: 'speaker' },
    { id: 'navigation', label: 'Navigation', className: 'feature-card--navigation', art: 'navigation' },
    { id: 'cursors', label: 'Cursors', className: 'feature-card--cursors', art: 'cursor' },
  ];

  return (
    <main className="page-frame" ref={pageRef}>
      <section className="product-highlights" aria-labelledby="product-title">
        <header className="product-heading">
          <h2 className="product-title dot-type" id="product-title">Product Highlights</h2>
          <p className="product-caption">Our devices, redefined</p>
        </header>
        <div className="feature-grid">
          {cards.map((card) => (
            <article
              className={`feature-card ${card.className}`}
              key={card.id}
              onPointerEnter={highlightPage}
              onPointerLeave={clearPageHighlight}
              onPointerMove={trackCardPointer}
              onFocus={highlightPage}
              onBlur={clearPageHighlight}
              tabIndex={0}
            >
              <div className={`feature-art feature-art--${card.art}`} aria-hidden="true">
                <img src={`/highlights/${card.id}.png`} alt="" loading="lazy" />
              </div>
              <span className="feature-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" /></svg></span>
              <h3 className="feature-label dot-type">{card.label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="hero" aria-labelledby="hero-title">
        <div className="dot-edge dot-edge--top" aria-hidden="true" />
        <div className="dot-edge dot-edge--bottom" aria-hidden="true" />
        <div className="dot-edge dot-edge--left" aria-hidden="true" />
        <div className="dot-edge dot-edge--right" aria-hidden="true" />
        <div className="hero-copy">
          <h1 className="dot-type dot-type--title" id="hero-title">Why Empire UI</h1>
          <div className="intro-wrap" ref={introRef}>
            <p className="intro dot-type dot-type--body">{introText}</p>
            <span className="intro-glitch-mask" aria-hidden="true" />
            <p className="intro intro-morse dot-type dot-type--body" aria-hidden="true">{introMorse}</p>
          </div>
        </div>

        <div className="word-stage" aria-hidden="true">
          <span className="dot-type dot-type--word">Empire UI</span>
        </div>

        <aside className="community">
          <h2 className="community-title dot-type dot-type--body">Join the community</h2>
          <p className="community-copy dot-type dot-type--body">For the latest updates &amp; discounts</p>
          <a className="community-link" href="https://discord.gg/RdKBQbFH" target="_blank" rel="noreferrer">
            <svg className="link-mark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.7c-2.2 2.6-4.1 6.4-4.1 10.3 0 2.1 1.1 3.6 2.2 4.4l.4-3.1h3l.4 3.1c1.1-.8 2.2-2.3 2.2-4.4 0-3.9-1.9-7.7-4.1-10.3Z" />
              <path d="m8 10-3.1 2.2 3.4 1.4M16 10l3.1 2.2-3.4 1.4M10.1 18.1l-.8 3.2 2.7-1.5 2.7 1.5-.8-3.2" />
              <circle cx="10.6" cy="10.7" r=".55" />
              <circle cx="13.4" cy="10.7" r=".55" />
            </svg>
            <span>Join community</span>
            <svg className="link-arrow" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 15 15 5M6 5h9v9" />
            </svg>
          </a>
        </aside>
        <SphereField />
      </section>
      <span className="interaction-note" aria-hidden="true">move near the spheres to light them</span>
    </main>
  );
}

const rootKey = Symbol.for('empire-ui.react-root');
const root = globalThis[rootKey] ?? createRoot(document.getElementById('root'));
globalThis[rootKey] = root;
root.render(<App />);
