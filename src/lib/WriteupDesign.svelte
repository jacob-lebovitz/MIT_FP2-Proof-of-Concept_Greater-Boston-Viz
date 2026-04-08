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
    <ul>
      <li>Our development process combined data exploration, data preparation, interface design, narrative writing, and web implementation. Because the project brings together geography, housing change, transit history, and interactive storytelling, we had to coordinate technical and interpretive work rather than treating the visualization as a standalone chart.</li>

      <li>We divided the work across the team according to both technical needs and content needs. Christian focused on assembling population and demographic data by ZIP code across the 2000–2025 period. Jacob focused on constructing household and housing-related data by ZIP code over the same time range. Eric created the repository and began building the time-evolving map centered on the Green Line and housing values. Hiro worked in parallel on the visualization itself, helping develop the interactive experience and the structure of the webpage.</li>

      <li>This division was useful because it allowed us to move forward on multiple fronts at once. While some team members focused on gathering and structuring the core datasets, others could begin implementing the interactive map and testing how the historical and geographic components would fit together in a web-based interface.</li>

      <li>In addition to these primary roles, the process remained collaborative. We discussed major design choices together, reviewed the evolving visualization as a group, and aligned the map, timeline, annotations, and surrounding narrative so that the project would feel like one coherent experience rather than several disconnected pieces.</li>

      <li>We estimate that the project so far has taken roughly 36–40 people-hours in total. A reasonable breakdown is about 8–10 hours per team member, with some variation depending on whether the work involved data assembly, implementation, writing, or integration.</li>

      <li>A rough estimate of individual contributions:
        <ul>
          <li>Christian: about 8–9 hours gathering, checking, and organizing population and demographic data by ZIP code, especially across a long time range where consistency and coverage matter.</li>
          <li>Jacob: about 8–9 hours identifying, cleaning, and structuring household and housing-related data by ZIP code over time.</li>
          <li>Eric: about 9–10 hours setting up the repository and beginning the implementation of the time-evolving map, including early visualization structure and integration of the Green Line with housing data.</li>
          <li>Hiro: about 9–10 hours working on the interactive webpage and visualization layer, including the evolving map experience and the online presentation of the project.</li>
        </ul>
      </li>

      <li>The most time-consuming part of the process was coordinating the relationship between the data and the interface. It was not enough to simply gather demographic, housing, and transit information; the data also had to be structured in a way that made temporal comparison, spatial comparison, and web implementation possible.</li>

      <li>Another time-intensive part was working across multiple time scales at once. Because the project spans 2000 to 2025, the team had to think carefully about consistency across years, the availability of comparable ZIP-code-level data, and how to present long-term change without overwhelming the reader.</li>

      <li>One strength of our process was parallelization. Splitting the work into demographic data, housing data, repository setup, and visualization development made it possible to build momentum quickly and avoid bottlenecks at the earliest stage of development.</li>

      <li>Another strength was that the process naturally connected content and implementation. The people working on data exploration were not isolated from the people building the visualization, which helped the team make design choices that were grounded in what the data could actually support.</li>

      <li>A challenge in our process was that some parts of the project evolved at the same time. The data structure, the visual form of the map, the historical annotations, and the surrounding narrative all influenced one another, so decisions in one area often required revisions in another. That made the process iterative, but also more time-consuming than a more linear workflow.</li>

      <li>Another challenge was balancing breadth and clarity. Because the topic involves housing, transit, geography, and long-term change, there was a natural tendency for the project to become more complex over time. Keeping the visualization readable while still preserving meaningful detail required repeated discussion and adjustment.</li>

      <li>Looking ahead, there are several ways we would improve our process. First, we would benefit from locking in the core story and user flow earlier, before refining too many secondary details. That would reduce rework and make later design decisions more efficient.</li>

      <li>Second, we would like to formalize the handoff between data work and visualization work more clearly. For example, having a more standardized intermediate dataset format earlier in the process would make it easier to connect new data layers to the interactive interface without additional restructuring.</li>

      <li>Third, we want to test the site earlier and more often with readers outside the immediate team. Because the project depends heavily on clarity of interpretation, external feedback is especially valuable for identifying where the visualization is intuitive and where it still needs stronger guidance.</li>

      <li>Finally, we would like to document intermediate decisions more systematically as we work. A clearer internal record of what was changed, why it was changed, and how it affects the narrative would make collaboration smoother and revision faster as the project grows.</li>

      <li>Overall, the development process has shown that building an interactive narrative about housing and transit requires more than assembling datasets and rendering a map. It requires careful coordination between data, design, historical framing, and usability. That coordination has been one of the most important parts of the project so far.</li>
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

  .writeup li ul {
    margin-top: 0.5rem;
  }
</style>
