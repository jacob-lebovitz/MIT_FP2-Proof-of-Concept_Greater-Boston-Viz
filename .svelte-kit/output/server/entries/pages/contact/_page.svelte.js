import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-5isd37_START -->${$$result.title = `<title>Contact me</title>`, ""}<!-- HEAD_svelte-5isd37_END -->`, ""} <h1 data-svelte-h="svelte-tbczl2">Contact</h1> <form action="mailto:hoga@mit.edu" method="GET" data-svelte-h="svelte-1p5ket3"><label>Subject:
        <input name="subject" value="Test Subject"></label> <label>Message:
        <textarea name="body">This is a test message.</textarea></label> <button>Submit</button></form>`;
});
export {
  Page as default
};
