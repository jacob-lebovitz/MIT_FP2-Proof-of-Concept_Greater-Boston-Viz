<div class="writeup">

  <section>
    <h2>A Rationale for and Critique of Our Design Decisions</h2>
    <!-- ============================================================
         READ RUBRIC FIRST and Describe:
         - Why you chose your visual encodings (choropleth, line chart, color by city, etc.)
         - What interaction techniques you chose and why (pan/zoom, click-to-highlight, drag year bar)
         - What alternatives you considered
         - How these choices serve your intended audience
         - What doesn't work as well as hoped, and how you'd improve it
         ============================================================ -->
    <p>INSERT WRITE-UP HERE</p>
  </section>

  <section>
    <h2>An Overview of Our Development Process and Opportunities to Improve</h2>
    <!-- ============================================================
         READ RUBRIC FIRST and Describe:
         - How work was split among team members
         - Roughly how many people-hours were spent
         - What aspects took the most time
         - How you hope to improve the process for future milestones
         ============================================================ -->
    <p>
    <ul>
  <li>We designed this visualization to help readers explore a difficult urban question spatially and temporally at the same time: how housing values changed between 2000 and 2025 in places connected to the Green Line and its extension. Because this question is fundamentally about place, proximity, and uneven change across neighborhoods, we chose a map as the main entry point rather than a purely statistical chart.</li>

  <li>Our central visual encoding is a choropleth map at the ZIP-code level. We use color intensity to represent home value because it allows readers to quickly compare places without having to read many individual numbers. Darker shades indicate higher values, while lighter shades indicate lower values. This supports a first-glance reading of the geography of housing value, which is important for readers who may not be familiar with Greater Boston but still want to understand where change is concentrated.</li>

  <li>We kept the legend bins fixed across all years so that the meaning of each color remains stable as the user moves through time. This was an important design decision because the project is not only about what housing values look like in one year, but about how they evolve. If the scale changed every year, viewers could misread relative increases as more dramatic or less dramatic than they really are.</li>

  <li>We overlaid the Green Line and the extension-related stations because transit is not just background context in this story; it is part of how readers orient themselves and interpret nearby housing changes. Showing the line directly on the map makes the relationship between transit geography and housing geography much more concrete than a text description alone.</li>

  <li>We also included milestone callouts tied to specific years, such as moments when the extension was approved, redesigned, delayed, restarted, or opened. These annotations help the reader connect the visual changes on the map to the broader timeline of the project. We wanted the interface to support a question like: “What did the surrounding housing landscape look like at this moment?” rather than forcing users to hold that historical context in memory.</li>

  <li>Our main interaction is the year slider. We chose this interaction because it encourages active exploration while remaining easy to understand. Instead of asking viewers to compare several separate static images, the slider lets them move continuously through the timeline and see how the map changes year by year. This is especially useful for a topic like housing change, where gradual shifts can matter as much as dramatic jumps.</li>

  <li>We also included zoom and reset controls because geographic visualizations can quickly become difficult to read if the reader cannot inspect local detail. These controls make the map more usable and let the viewer focus on particular clusters or ZIP codes without losing the larger context.</li>

  <li>The line chart below the map complements the spatial view by showing how home values change over time. We did not want the project to rely on a single map snapshot, because a map is good at showing where differences exist, but weaker at showing how those differences unfold. The time series adds that second dimension and helps readers compare broad trajectories, not just end states.</li>

  <li>In terms of audience, we wanted the design to remain approachable for people who are interested in housing and transit but may not be specialists in GIS, planning, or policy. For that reason, we favored a relatively simple visual language: a familiar map, a clear legend, a single time control, and short milestone annotations. At the same time, the design still gives more engaged readers enough depth to make comparisons and form their own interpretations.</li>

  <li>We considered other possible approaches. One alternative was a more dashboard-like interface with many controls and layers visible at once. Another was a more abstract chart-first design focused on statistical comparison. We moved away from those options because they either made the story harder to follow or weakened the role of geography, which is central to the project. The current design prioritizes clarity and narrative legibility over maximum analytic density.</li>

  <li>One thing that works well in the current design is that it reveals uneven change clearly. As the reader moves through time, it becomes possible to see that home values generally rise across the region, but not uniformly. Some places remain consistently stronger than others, and the presence of new transit infrastructure does not automatically translate into a uniform visual pattern across nearby ZIP codes.</li>

  <li>At the same time, there are limits to what the current design does well. The visualization is much better at showing patterns than proving causation. It can help readers see how housing values and Green Line milestones line up in time and space, but it cannot by itself isolate the effect of transit from all other neighborhood changes happening at the same time.</li>

  <li>Another limitation is visual density. The map includes multiple layers at once: ZIP polygons, ZIP labels, city labels, transit lines, stations, milestone text, and the legend. While this richness supports exploration, it can also compete for attention. A first-time viewer may not immediately know where to look first.</li>

  <li>The narrative flow can also become stronger. The current design gives the reader useful tools, but it still relies on the reader to infer some of the larger takeaway. In future iterations, we would like to guide that reading more clearly by strengthening the transition between the map, the line chart, and the written explanation around them.</li>

  <li>In future versions, we would improve the design in three main ways. First, we would sharpen the visual hierarchy so that the main comparison is more obvious at first glance. Second, we would make the relationship between the map and line chart even more explicit through stronger linking or highlighting. Third, we would add clearer comparative context so readers can better distinguish between broad regional market growth and changes that appear more localized around the Green Line corridor.</li>
</ul>

    </p>
  </section>

</div>

<style>
  .writeup {
    max-width: 720px;
    line-height: 1.75;
    font-size: 1rem;
    margin-top: 3rem;
  }

  section {
    margin-bottom: 2.5rem;
  }

  h2 {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    border-bottom: 2px solid oklch(80% 3% 200);
    padding-bottom: 0.4rem;
  }
</style>
