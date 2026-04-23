<div class="title-page">
  <div class="title-content">
    <div class="eyebrow">Greater Boston Housing &amp; Transit</div>
    <h1 class="main-title">Does Transit Access<br/>Drive Up Housing Costs?</h1>
    <p class="subtitle">
      Tracking home values, new developments, and the Green Line Extension
      across Cambridge, Somerville, and Medford — 2000 to 2025.
    </p>
    <div class="scroll-cue" aria-hidden="true">
      <span>Scroll to explore</span>
      <div class="arrow">↓</div>
    </div>
  </div>

  <div class="bg-line" aria-hidden="true">
    <svg viewBox="0 0 200 600" preserveAspectRatio="none">
      <path d="M 100 0 C 100 150, 60 200, 80 300 C 100 400, 140 450, 100 600"
        fill="none" stroke="#00843D" stroke-width="4" opacity="0.18" />
      <circle cx="100" cy="80" r="7" fill="none" stroke="#00843D" stroke-width="2.5" opacity="0.22" />
      <circle cx="80" cy="300" r="7" fill="none" stroke="#00843D" stroke-width="2.5" opacity="0.22" />
      <circle cx="100" cy="520" r="7" fill="none" stroke="#00843D" stroke-width="2.5" opacity="0.22" />
    </svg>
  </div>
</div>

<style>
  .title-page {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid light-dark(#e2e8f0, #2d3748);
  }

  .title-content {
    position: relative;
    z-index: 1;
    max-width: 680px;
    padding: 4rem 0 6rem;
  }

  .eyebrow {
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    font-weight: 600;
    text-transform: uppercase;
    color: #00843D;
    margin-bottom: 1.25rem;
  }

  .main-title {
    font-size: clamp(2.4rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1.5rem;
    letter-spacing: -0.02em;
    color: light-dark(#0f172a, #f1f5f9);
  }

  .subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: light-dark(#475569, #94a3b8);
    max-width: 540px;
    margin: 0 0 3rem;
  }

  .scroll-cue {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    font-size: 0.82rem;
    letter-spacing: 0.1em;
    color: light-dark(#64748b, #64748b);
    text-transform: uppercase;
  }

  .arrow {
    font-size: 1.2rem;
    animation: bounce 1.8s ease-in-out infinite;
    color: #00843D;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }

  .bg-line {
    position: absolute;
    right: 0;
    top: 0;
    width: 220px;
    height: 100%;
    pointer-events: none;
  }

  .bg-line svg {
    width: 100%;
    height: 100%;
  }
</style>
