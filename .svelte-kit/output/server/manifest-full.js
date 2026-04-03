export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "MIT_FP2-Proof-of-Concept_Greater-Boston-Viz/_app",
	assets: new Set([".DS_Store","favicon.png","housing.json","images/.DS_Store","massachusetts-zip-codes.geojson","mbta_green_line.geojson","mbta_green_line_stations.json","style.css"]),
	mimeTypes: {".png":"image/png",".json":"application/json",".geojson":"application/geo+json",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.aef3dc70.js","app":"_app/immutable/entry/app.58b472be.js","imports":["_app/immutable/entry/start.aef3dc70.js","_app/immutable/chunks/scheduler.08babe91.js","_app/immutable/chunks/singletons.888509f4.js","_app/immutable/entry/app.58b472be.js","_app/immutable/chunks/scheduler.08babe91.js","_app/immutable/chunks/index.5bd3f010.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
