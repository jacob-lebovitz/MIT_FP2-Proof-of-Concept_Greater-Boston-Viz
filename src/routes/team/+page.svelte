<script>
  const members = [
    {
      name: 'Jacob Lebovitz',
      photo: null,
      programs: ['MIT Management', 'Business Analytics'],
    },
    {
      name: 'Eric Christenson',
      photo: null,
      programs: ['MIT Management', 'Business Analytics'],
    },
    {
      name: 'Christian Lopez Angeles',
      photo: null,
      programs: ['MIT EECS'],
    },
    {
      name: 'Hiro Ogasawara',
      photo: null,
      programs: ['MIT SDM', 'MIT EECS'],
    },
  ];

  const PROGRAM_COLORS = {
    'MIT Management': '#8B0000',
    'Business Analytics': '#A31F34',
    'MIT EECS': '#6D6E71',
    'MIT SDM': '#1B4F9B',
  };
</script>

<div class="team-page">
  <h1 class="team-title">Greater Boston Viz Team</h1>

  <div class="members">
    {#each members as member}
      <div class="member">
        <p class="name">{member.name}</p>
        <div class="photo-ring">
          {#if member.photo}
            <img src={member.photo} alt={member.name} />
          {:else}
            <div class="placeholder">
              {member.name.split(' ').map(w => w[0]).join('')}
            </div>
          {/if}
        </div>
        <div class="programs">
          {#each member.programs as prog}
            <span class="badge" style="background:{PROGRAM_COLORS[prog] ?? '#555'}">{prog}</span>
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
    color: inherit;
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 0 1.5rem 0;
  }

  .members {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    width: 180px;
  }

  .name {
    color: inherit;
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
    margin: 0;
    border-bottom: 2px solid #ccc;
    padding-bottom: 0.4rem;
    width: 100%;
  }

  .photo-ring {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 4px solid #ccc;
    overflow: hidden;
    background: #ddd;
  }

  .photo-ring img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #666;
    background: #ddd;
  }

  .programs {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    align-items: center;
  }

  .badge {
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
  }
</style>
