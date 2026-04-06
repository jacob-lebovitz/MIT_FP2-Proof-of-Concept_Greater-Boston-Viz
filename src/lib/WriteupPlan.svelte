<div class="writeup">

  <section>
    <h2>A Final Project Plan</h2>
    <!-- ============================================================
         READ RUBRIC FIRST and Include:
         - The specific order in which visualization and narrative components will be implemented
         - A breakdown into manageable tasks
         - Assignment of each task to a team member with a deadline
         - A contingency paragraph: what will you do if something goes wrong?
           Which tasks might be dropped? What functionality might fall out of scope?
         ============================================================ -->
    <p>
    <ul>
      <li>Additional Data Collection
        <ul>
          <li>Week 4/6
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Continue collecting data with a zipcode level granularity</li>
                  <li>Jacob: collect data on demographics by zip code for date range 2000-2025</li>
                  <li>Christian: collect data on population by zip code for date range 2000-2025</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Week 4/13
            <ul>
              <li>Team Plan
                <ul>
                  <li>Iteratively assess whether there is a strong need for new data in order to better understand the impact of green line expansion</li>
                  <li>Jacob: Gather city-wide Boston data on population changes, demographic changes, and income changes in order to normalize changes in zip codes near expansion stations</li>
                  <li>Christian: Gather remaining data to complete narrative, working with Eric and Hiro to determine necessary data</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    
      <li>Beautify visualization with scrolling mechanisms, etc.
        <ul>
          <li>Week 4/6
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Improve visualization with scrolling mechanism and changing narrative, and implementing font and color categories from the initial project plan</li>
                  <li>Hiro: implement scrolling and other interactive features into the proof-of-concept svelte visualization</li>
                  <li>Eric: implement green line expansion into scrolling visualization, adding station information and lat/lon signals to best show growth of transit</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Week 4/13
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Continue implementing new datasets into the interactive visualizations (housing developments, demographics, population), and experiment with unique ways to represent each dataset</li>
                  <li>Jacob: upload housing development dataset to svelte and create point-wise housing development visualization</li>
                  <li>Hiro: adjust visualizations to fine-tune each one based on the specific data to make the best impact based on the narrative</li>
                  <li>Christian: upload housing population data to svelte and create choloplot map of population changes</li>
                  <li>Eric: add narrative elements to the scrolling timeline of visualization for each dataset, while also informing design choices</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    
      <li>Feedback Implementation
        <ul>
          <li>Week 4/6
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Review specific feedback given during the project pitch presentation and during office hours</li>
                  <li>Research articles about TOD to establish a holistic understanding of narrative and know the necessary data to include in our visualization</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    
      <li>Narrative Iteration
        <ul>
          <li>Week 4/6
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Generate a first-draft of a narrative that explains changes in data due to green line expansion, based on initial EDA and modeling findings</li>
                  <li>Eric: Read TOD articles and understand how green line and transit expansions impact communities (both positively and negatively)</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Week 4/13
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Develop a narrative that leads to a policy-based solution or recommendation for future expansions, transit oriented development, or other housing/transit-focused measure to improve Boston resident satisfaction</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    
      <li>MVP (F3)
        <ul>
          <li>Week 4/20
            <ul>
              <li>Team Plan:
                <ul>
                  <li>Eric: Finalize narrative and implement different stories into the scrolling aspect of the visualization</li>
                  <li>Hiro: Publish project to public URL for display while noting any bugs that need fixing</li>
                  <li>Jacob: Refine project visuals and focus on audience tone and necessary features</li>
                  <li>Christian: Create demo plan to show the key features of the product, handle demo walkthrough while recording the video</li>
                  <li>Team: record 5 minute video demonstrating our MVP</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    
      <li>Final Deliverable
        <ul>
          <li>Week of 4/27
            <ul>
              <li>Team Plan:
                <ul>
                  <li>All-hands working sessions (multiple) to finalize project plan and make necessary changes from the critique</li>
                  <li>Eric/Jacob: Justify key results from the data analysis in the final report</li>
                  <li>Hiro/Christian: Justify the design choices in the final project in the final report</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    </p>
  </section>

</div>

<style>
  .writeup {
    max-width: 720px;
    line-height: 1.75;
    font-size: 1rem;
    margin-top: 1rem;
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
