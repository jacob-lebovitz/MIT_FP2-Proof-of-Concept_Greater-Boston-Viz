<script>
  import { base } from '$app/paths';

  const members = [
    {
      name: 'Jacob Lebovitz',
      photo: `${base}/images/jacob.jpg`,
      linkedin: 'https://www.linkedin.com/in/jacob-lebovitz/',
      programs: ['MIT Management', 'Business Analytics'],
    },
    {
      name: 'Eric Christenson',
      photo: `${base}/images/Eric.jpg`,
      linkedin: 'https://www.linkedin.com/in/ericchristenson123/',
      programs: ['MIT Management', 'Business Analytics'],
    },
    {
      name: 'Christian Lopez Angeles',
      photo: `${base}/images/Christian.jpg`,
      linkedin: 'https://www.linkedin.com/in/christian-emmanuel-lopez-angeles/',
      programs: ['MIT EECS'],
    },
    {
      name: 'Hiro Ogasawara',
      photo: `${base}/images/Hiro.png`,
      linkedin: 'https://www.linkedin.com/in/hiroki-ogasawara/',
      programs: ['MIT SDM', 'MIT EECS'],
    },
  ];

  const PROGRAM_LOGOS = {
    'MIT Management': `${base}/images/Sloan Analytics.png`,
    'Business Analytics': `${base}/images/Sloan Analytics.png`,
    'MIT EECS': `${base}/images/EECS.png`,
    'MIT SDM': `${base}/images/SDM.png`,
  };

  // Deduplicate logos per member (e.g. MIT Management + Business Analytics share same logo)
  function uniqueLogos(programs) {
    const seen = new Set();
    return programs.filter(p => {
      const logo = PROGRAM_LOGOS[p];
      if (seen.has(logo)) return false;
      seen.add(logo);
      return true;
    });
  }
</script>

<div class="team-page">
  <h1 class="team-title">Greater Boston Viz Team</h1>

  <div class="members">
    {#each members as member}
      <div class="member">
        <div class="photo-ring">
          <img src={member.photo} alt={member.name} />
        </div>
        <a class="name" href={member.linkedin} target="_blank" rel="noopener noreferrer">
          {member.name}
          <span class="li-icon">in</span>
        </a>
        <div class="logos">
          {#each uniqueLogos(member.programs) as prog}
            <img src={PROGRAM_LOGOS[prog]} alt={prog} class="program-logo {prog === 'MIT Management' || prog === 'Business Analytics' ? 'sloan' : ''}" />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .team-page {
    padding: 2rem 0;
    margin: 1rem 0;
  }

  .team-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 0 2rem 0;
  }

  .members {
    display: flex;
    gap: 2rem;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 200px;
    flex-shrink: 0;
  }

  .photo-ring {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ccc;
    background: #ddd;
  }

  .photo-ring img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name {
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
    margin: 0;
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    justify-content: center;
  }

  .name:hover { text-decoration: underline; }

  .li-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #0a66c2;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .logos {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .program-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
  }

  .program-logo.sloan {
    height: 64px;
  }
</style>
