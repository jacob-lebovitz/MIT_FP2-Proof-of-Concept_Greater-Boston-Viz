<div class="title-page">
  <div class="title-content content-narrow">
    <div class="eyebrow">A 25-year story · Cambridge, Somerville &amp; Medford</div>
    <h1 class="main-title">
      The Green Line was supposed to push prices up.<br/>
      <span class="accent">It didn't.</span>
    </h1>
    <p class="subtitle">
      For two decades, residents along the planned Green Line Extension feared the same fate as Red Line neighborhoods —
      premium prices, displacement, lost affordability. Opponents sued; supporters fought; the project nearly died in 2015
      and only opened in 2022. This is what actually happened to home values and new housing along the corridor —
      and why it's not the story most people expected.
    </p>

    <div class="history-strip">
      <div class="hist-item">
        <div class="hist-year">2005</div>
        <div class="hist-text">Conservation Law Foundation sues over the long-stalled extension.</div>
      </div>
      <div class="hist-item">
        <div class="hist-year">2012</div>
        <div class="hist-text">Construction breaks ground after a 2007 settlement.</div>
      </div>
      <div class="hist-item">
        <div class="hist-year">2015</div>
        <div class="hist-text">Project nearly cancelled — costs balloon to $3B.</div>
      </div>
      <div class="hist-item">
        <div class="hist-year">2022</div>
        <div class="hist-text">Union Square &amp; Medford branch open after a redesign.</div>
      </div>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <span>Scroll to follow the prices</span>
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
    padding: 4rem 1rem 6rem;
    width: 100%;
  }

  .eyebrow {
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    text-transform: uppercase;
    color: #00843D;
    margin-bottom: 1.25rem;
  }

  .main-title {
    font-size: clamp(2.2rem, 5.5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1.5rem;
    letter-spacing: -0.02em;
    color: light-dark(#0f172a, #f1f5f9);
  }

  .main-title .accent { color: #00843D; }

  .subtitle {
    font-size: 1.05rem;
    line-height: 1.7;
    color: light-dark(#475569, #94a3b8);
    margin: 0 0 2.4rem;
  }

  .history-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
    padding-block: 1.2rem;
    border-top: 1px solid light-dark(#e2e8f0, #2d3748);
    border-bottom: 1px solid light-dark(#e2e8f0, #2d3748);
  }

  .hist-item {
    border-left: 3px solid #00843D;
    padding-left: 0.7rem;
  }

  .hist-year {
    font-size: 0.95rem;
    font-weight: 800;
    color: #00843D;
    letter-spacing: -0.01em;
    margin-bottom: 0.15rem;
  }

  .hist-text {
    font-size: 0.78rem;
    line-height: 1.45;
    color: light-dark(#475569, #94a3b8);
  }

  .scroll-cue {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    color: light-dark(#64748b, #94a3b8);
    text-transform: uppercase;
    font-weight: 600;
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

  .bg-line svg { width: 100%; height: 100%; }
</style>
