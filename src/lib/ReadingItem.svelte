<script>
  export let data = {};
</script>

<article>
  <img src={data.image} alt={data.title}>
  <div class="info">
    <h3>{data.title}</h3>
    <p class="author">{data.author}</p>
  </div>
</article>

<style>
  article {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  img {
    width: 80px;
    height: 120px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
  }

  h3 {
    margin: 0 0 0.3rem 0;
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1.3;
  }

  .author {
    margin: 0;
    font-size: 0.95rem;
    color: #666;
  }
</style>