import{j as u,c as o,a as s,r as i}from"./iframe-BAAMxX04.js";import{u as l,r as c}from"./useStyles-CmT3Dfol.js";const t=o("bg-context");function d(e){return e?e==="neutral-1"?"neutral-2":e==="neutral-2"||e==="neutral-3"?"neutral-3":e:"neutral-1"}const m=({bg:e,children:r})=>u.jsx(t.Provider,{value:s({1:{bg:e}}),children:r});function p(){return i.useContext(t)?.atVersion(1)??{bg:void 0}}function f(e){const{breakpoint:r}=l(),a=p();if(e===void 0)return{bg:void 0};const n=c(e,r);return n==="neutral-auto"?{bg:d(a.bg)}:{bg:n}}m.__docgenInfo={description:`Provider component that establishes the bg context for child components.

@public`,methods:[],displayName:"BgProvider",props:{bg:{required:!0,tsType:{name:"union",raw:`| 'neutral-1'
| 'neutral-2'
| 'neutral-3'
| 'danger'
| 'warning'
| 'success'`,elements:[{name:"literal",value:"'neutral-1'"},{name:"literal",value:"'neutral-2'"},{name:"literal",value:"'neutral-3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{m as B,p as a,f as u};
