<script>
  import projects from '$lib/projects.json';
  import Project from "$lib/Project.svelte";
  import reading from '$lib/reading.json';
  import ReadingItem from "$lib/ReadingItem.svelte";
  import { onMount } from "svelte";
  let githubData = null; // This will eventually hold our Github stats
  let loading = true; // This will be true *until* the fetch's promise resolves to a value
  let error = null; // If the API call resulted in an error, it will go into this variable
  let data = fetch("https://api.github.com/users/hiromitsdm");
 
  onMount(async () => {
    try {
      console.log("Page has been mounted!")
      let response = await fetch("https://api.github.com/users/hiromitsdm");
      console.log(response);
      githubData = await response.json();
      console.log(githubData);
    } catch (err) {
      error = err;
    }
    loading = false;
  });
</script>

<div class="intro-section">
  <div class="bio">
    <h1>Hiro Ogasawara</h1>
    <p>Currently completing my dual master's in Engineering Management and Electrical Engineering & Computer Science at MIT, I spent 2025 as an MIT-Riccio Engineering Leadership Resident at Apple Park, working on early-stage product architecture for next-generation products. That experience taught me that the best engineering isn't just about technical excellence—it's about navigating ambiguity, learning rapidly, and collaborating across functions to turn vision into reality. This builds on a decade at Toyota, where I learned what it really takes to ship great products at scale. Starting as a body design engineer in 2013, I progressed through roles spanning fuel tanks, underbody platforms, and exterior components (doors, hoods, fenders, bumpers) for vehicles ranging from 35,000-unit-per-month mass production to ultra-low-volume super sports cars. As Assistant Manager and TPS Lecturer, I led cross-functional teams across Japan, the US, and China, drove $10M+ in value engineering through a patented sealing structure, and improved design productivity by 25% by innovating visualization processes using the Toyota Production System. Toyota taught me that great engineering isn't just about CAD models and simulations—it's about the systems and workflows that eliminate waste and let engineers focus on work that actually matters. Now I'm founding my own startup, applying those lessons to build tools that streamline engineering design projects.</p>
    <p>Outside of work, I'm Co-GM of MIT Driverless, leading a 28-member team preparing for the Abu Dhabi Autonomous Racing League. I'm also a competitive marathon runner who recently qualified for Boston with a 2:53:25 finish.</p>
    <img src="./images/headshot-Hiro.png" alt="Hiro Ogasawara">
  </div>

  <div class="reading-sidebar">
    <h2>What I'm Reading</h2>
    <div class="reading">
      {#each reading as book}
        <ReadingItem data={book} />
      {/each}
    </div>
  </div>
</div>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Something went wrong: {error.message}</p>
{:else}
    <section class="github-stats">
        <h2>My GitHub Stats</h2>
        <dl class="stats-grid">
            <dt>Followers</dt>
            <dt>Following</dt>
            <dt>Public Repos</dt>
            <dt>Public Gists</dt>
            <dd>{githubData.followers}</dd>
            <dd>{githubData.following}</dd>
            <dd>{githubData.public_repos}</dd>
            <dd>{githubData.public_gists}</dd>
        </dl>
    </section>
{/if}

<h2>Latest Projects</h2>

<div class="projects">
  {#each projects.slice(0, 3) as p}
    <Project data={p} />
  {/each}
</div>

<style>
  .intro-section {
    display: flex;
    gap: 3rem;
    margin-bottom: 3rem;
    align-items: flex-start;
  }

  .bio {
    flex: 2;
  }

  .reading-sidebar {
    flex: 1;
    background-color: light-dark(#f5f5f5, black);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .reading-sidebar h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .github-stats {
    border: 1px solid light-dark(#ddd, #444);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .github-stats h2 {
    margin-top: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .stats-grid dt {
    grid-row: 1;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: light-dark(#666, #aaa);
  }

  .stats-grid dd {
    grid-row: 2;
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }

  /* Make it stack on smaller screens */
  @media (max-width: 768px) {
    .intro-section {
      flex-direction: column;
    }
  }
</style>