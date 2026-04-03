export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "MIT_FP2-Proof-of-Concept_Greater-Boston-Viz/_app",
	assets: new Set([".DS_Store","favicon.png","images/.DS_Store","images/A2_Fig 8.png","images/A3_Fig 4.png","images/A4_Growth.png","images/apple park.jpg","images/boston.jpeg","images/business-platforms.jpg","images/dfm-handbook.jpg","images/engineering startup.png","images/ev platform.jpg","images/ford ev.jpg","images/gryaris body.jpg","images/headshot-Hiro.png","images/idj.png","images/mit driverless.jpg","images/product-design-dev.jpg","images/student leadership.jpeg","images/system-architecture.jpg","images/tech-roadmapping.jpg","lab6_example.json","loc.csv","style.css"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".json":"application/json",".csv":"text/csv",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.0233645f.js","app":"_app/immutable/entry/app.950c1e30.js","imports":["_app/immutable/entry/start.0233645f.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/singletons.e8511b7f.js","_app/immutable/chunks/paths.10262705.js","_app/immutable/entry/app.950c1e30.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/meta",
				pattern: /^\/meta\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/projects",
				pattern: /^\/projects\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/resume",
				pattern: /^\/resume\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
