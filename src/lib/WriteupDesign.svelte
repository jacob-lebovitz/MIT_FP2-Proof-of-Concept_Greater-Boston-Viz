<div class="writeup">

  <section>
    <h2>A Rationale for and Critique of Our Design Decisions</h2>
    <ul>
      <li>We designed this visualization to help readers explore how housing values changed between 2000 and 2025 in places connected to the Green Line and its extension. Because this question is fundamentally geographic, we chose a map as the main entry point rather than a purely statistical chart.</li>

      <li>Our central visual encoding is a choropleth map at the ZIP-code level. We use color intensity to represent home value because it allows readers to compare places quickly without needing to read many individual numbers. We also kept the legend bins fixed across all years so that the meaning of each color remains stable as the user moves through time.</li>

      <li>We overlaid the Green Line and the extension-related stations because transit is central to the story, not just background context. Showing the line directly on the map makes the relationship between transit geography and housing geography much more concrete.</li>

      <li>We included milestone callouts tied to specific years so readers can connect visible changes on the map to key moments in the Green Line Extension timeline. This helps the interface support a question like: “What did the surrounding housing landscape look like at this moment?”</li>

      <li>Our main interaction is the year slider. We chose this because it encourages active exploration while remaining easy to understand. Instead of comparing a few static snapshots, readers can move through the timeline continuously and inspect change year by year.</li>

      <li>We also included zoom and reset controls because geographic visualizations can become difficult to read without local inspection. In addition, users can highlight a line in the time-series chart by hovering over the corresponding area on the map, and vice versa. This stronger linking helps readers connect spatial patterns with temporal trajectories.</li>

      <li>The line chart below the map complements the spatial view by showing how home values evolve over time. Including the graph within the scrolling narrative also helps readers understand where they are in the larger trend of housing value change, rather than relying only on a single map state.</li>

      <li>We wanted the design to remain approachable for readers interested in housing and transit, even if they are not specialists in GIS or planning. For that reason, we favored a familiar map, a clear legend, a simple time control, and concise annotations rather than a denser dashboard with many simultaneous controls.</li>

      <li>One strength of the current design is that it makes uneven change visible. Readers can see that home values generally rise across the region, but not uniformly, and that proximity to new transit does not automatically translate into the same visual pattern across nearby ZIP codes.</li>

      <li>At the same time, the current design has limits. It is stronger at showing patterns than proving causation, and the map still contains several competing layers at once. In future versions, we would strengthen the visual hierarchy, improve the linkage between map and chart even further, and add clearer comparative context so readers can better distinguish broad regional market growth from more localized change around the Green Line corridor.</li>
    </ul>
  </section>

  <section>
    <h2>An Overview of Our Development Process and Opportunities to Improve</h2>
    <ul>
      <li>Our development process combined data exploration, data preparation, interface design, narrative writing, and web implementation. Because the project brings together geography, housing change, transit history, and interactive storytelling, we had to coordinate technical and interpretive work rather than treating the visualization as a standalone chart.</li>

      <li>We divided the work across the team according to both technical and content needs. Christian focused on assembling population and demographic data by ZIP code across the 2000–2025 period. Jacob focused on constructing household and housing-related data by ZIP code over the same time range. Eric created the repository and began building the time-evolving map centered on the Green Line and housing values. Hiro worked in parallel on the visualization itself, helping develop the interactive experience and the structure of the webpage.</li>

      <li>This division was useful because it allowed us to move forward on multiple fronts at once. While some team members focused on gathering and structuring the core datasets, others could begin implementing the interactive map and testing how the historical and geographic components would fit together in a web-based interface.</li>

      <li>We estimate that the project so far has taken roughly 36–40 people-hours in total, or about 8–10 hours per team member. Christian spent about 8–9 hours on population and demographic data, Jacob about 8–9 hours on household and housing data, Eric about 9–10 hours on repository setup and early map implementation, and Hiro about 9–12 hours on the interactive webpage and visualization layer.</li>

      <li>The most time-consuming part of the process was coordinating the relationship between the data and the interface. It was not enough to gather demographic, housing, and transit information; the data also had to be structured in a way that made temporal comparison, spatial comparison, and web implementation possible.</li>

      <li>One strength of our process was parallelization. Splitting the work into demographic data, housing data, repository setup, and visualization development helped us build momentum quickly and avoid early bottlenecks. Another strength was that content and implementation remained closely connected, which helped keep design decisions grounded in what the data could actually support.</li>

      <li>A challenge in our process was that the data structure, visual form, annotations, and narrative all evolved at the same time. Decisions in one area often required revisions in another, which made the process iterative but also more time-consuming than a more linear workflow.</li>

      <li>Looking ahead, we would improve our process in three ways: by locking in the core story and user flow earlier, by making the handoff between data work and visualization work more standardized, and by testing the site earlier with readers outside the immediate team so we can identify confusion sooner.</li>

      <li>Overall, the development process showed that building an interactive narrative about housing and transit requires more than assembling datasets and rendering a map. It requires careful coordination between data, design, historical framing, and usability.</li>
    </ul>
  </section>

</div>

<style>
  .writeup {
    max-width: 720px;
    line-height: 1.75;
    font-size: 1rem;
    margin-top: 3rem;
  }

  .writeup section {
    margin-bottom: 2.5rem;
  }

  .writeup h2 {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    border-bottom: 2px solid oklch(80% 3% 200);
    padding-bottom: 0.4rem;
  }

  .writeup ul {
    padding-left: 1.4rem;
    margin: 0;
  }

  .writeup li {
    margin-bottom: 0.85rem;
  }
</style>
