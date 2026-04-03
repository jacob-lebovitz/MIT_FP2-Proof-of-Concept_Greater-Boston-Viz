<script>
function handleSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let data = new FormData(form);

    let url = form.action + "?";
    for (let [name, value] of data) {
        url += (name + "=" + encodeURIComponent(value) + "&");
    }

    location.href = url;
}
</script>

<svelte:head>
  <title>Contact me</title>
</svelte:head>

<h1>Contact</h1>

<form action="mailto:hoga@mit.edu" method="GET" on:submit={handleSubmit}>
    <label>
        Subject:
        <input name="subject" value="Test Subject">
    </label>
    <label>
        Message:
        <textarea name="body">This is a test message.</textarea>
    </label>
    <button>Submit</button>
</form>
