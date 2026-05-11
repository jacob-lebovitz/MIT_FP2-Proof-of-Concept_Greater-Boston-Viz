<section class="acks" aria-labelledby="acks-heading">
  <div class="acks-eyebrow">CREDITS</div>
  <h2 id="acks-heading">Acknowledgements</h2>

  <p class="partner-note">
    This project was developed with guidance and feedback from the
    <a href="https://www.mapc.org/" target="_blank" rel="noopener noreferrer">Metropolitan Area Planning Commission (MAPC)</a>.
  </p>

  <h3>Data sources</h3>
  <ul class="ack-list">
    <li>
      <strong>ZIP-code home value time series (2000–2025).</strong>
      Zillow Home Value Index (ZHVI) for single-family homes by ZIP code —
      <a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer">Zillow Research Data</a>.
    </li>
    <li>
      <strong>Housing development pipeline.</strong>
      <a href="https://massbuilds.com/" target="_blank" rel="noopener noreferrer">MassBuilds</a>,
      maintained by the Metropolitan Area Planning Council (MAPC).
    </li>
    <li>
      <strong>ZIP Code Tabulation Areas (ZCTAs).</strong>
      U.S. Census Bureau 2020 Cartographic Boundary files —
      <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html" target="_blank" rel="noopener noreferrer">Census ZCTA 2020</a>.
    </li>
    <li>
      <strong>Metro Boston municipal boundaries (surrounding towns).</strong>
      MassGIS, via the
      <a href="https://datacommon.mapc.org/browser/datasets/390" target="_blank" rel="noopener noreferrer">MAPC Data Common</a>.
    </li>
    <li>
      <strong>MBTA Green Line &amp; Red Line geometry and stations.</strong>
      Derived from the
      <a href="https://www.mbta.com/developers/gtfs" target="_blank" rel="noopener noreferrer">MBTA GTFS feed</a>
      (Massachusetts Bay Transportation Authority, Winter 2025) using
      <a href="https://github.com/blinktaginc/gtfs-to-geojson" target="_blank" rel="noopener noreferrer">gtfs-to-geojson</a>,
      with preparation scripts from
      <a href="https://github.com/RicoFio/vis-society-25-gtfs-prep" target="_blank" rel="noopener noreferrer">vis-society-25-gtfs-prep</a>.
    </li>
    <li>
      <strong>MBTA Green Line Extension station opening dates &amp; project timeline.</strong>
      MBTA project pages and contemporaneous reporting from
      <a href="https://www.bostonglobe.com/" target="_blank" rel="noopener noreferrer">The Boston Globe</a>
      (notably the Aug. 2015 cost-overrun and Mar. 2022 Union Sq. opening coverage).
    </li>
    <li>
      <strong>Cambridge inclusionary-zoning context.</strong>
      <a href="https://www.cambridgema.gov/CDD/housing/inclusionaryhousing" target="_blank" rel="noopener noreferrer">City of Cambridge — Inclusionary Housing</a>
      and
      <a href="https://dash.harvard.edu/entities/publication/ffbbc9de-d3d7-4de1-add2-47303bfad3e9" target="_blank" rel="noopener noreferrer">Harvard DASH publication</a>.
      Critical perspective via the
      <a href="https://betterblocksnj.org/2026/03/03/does-unfunded-inclusionary-zoning-produce-affordable-housing-at-scale-part-iv-in-our-housing-policy-series/" target="_blank" rel="noopener noreferrer">New Haven Zoning Study</a>.
    </li>
  </ul>

  <h3>AI assistance</h3>
  <ul class="ack-list">
    <li>
      Portions of the SvelteKit + D3.js implementation, styling, and editorial
      copy were drafted and iterated with the help of Anthropic's
      <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener noreferrer">Claude</a>
      via <a href="https://claude.com/claude-code" target="_blank" rel="noopener noreferrer">Claude Code</a>.
      All design decisions, data choices, and interpretive claims were reviewed
      and approved by the project authors.
    </li>
  </ul>

  <h3>Imagery</h3>
  <ul class="ack-list">
    <li>
      Red Line, GLX construction, Union Sq. opening, and groundbreaking photos —
      from publicly available Boston Globe, MBTA, and local news reporting on the
      Green Line Extension project.
    </li>
    <li>
      Somerville Times newspaper clipping (Mar. 2025) —
      <a href="https://www.thesomervilletimes.com/" target="_blank" rel="noopener noreferrer">The Somerville Times</a>.
    </li>
  </ul>
</section>

<style>
  .acks {
    margin: 0 auto;
    padding: 4rem 2rem 5rem;
    border-top: 1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.1));
    color: light-dark(#334155, #cbd5e1);
  }

  .acks-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: #00843D;
    margin-bottom: 0.9rem;
  }

  h2 {
    font-size: clamp(1.55rem, 2.2vw, 1.95rem);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.015em;
    margin: 0 0 1.1rem;
    color: light-dark(#0f172a, #f1f5f9);
  }

  h3 {
    font-size: 0.95rem;
    margin: 1.8rem 0 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #00843D;
  }

  .partner-note {
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.85rem 1rem;
    border-left: 3px solid #00843D;
    background: light-dark(rgba(0,132,61,0.06), rgba(0,132,61,0.14));
    border-radius: 0 6px 6px 0;
    margin: 0 0 1.5rem;
  }

  .ack-list {
    list-style: disc;
    padding-left: 1.25rem;
    margin: 0;
  }

  .ack-list li {
    font-size: 0.92rem;
    line-height: 1.6;
    margin-bottom: 0.65rem;
  }

  .ack-list strong {
    color: light-dark(#0f172a, #f1f5f9);
  }

  a {
    color: #00843D;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
  a:hover { text-decoration-thickness: 2px; }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.85em;
    padding: 0.05em 0.3em;
    background: light-dark(rgba(15,23,42,0.06), rgba(255,255,255,0.08));
    border-radius: 3px;
  }
</style>
