import{r as i,c as o,j as u,a as s}from"./iframe-M9O-K8SB.js";const t=o("surface-context");function m(e){return e?e==="0"?"1":e==="1"?"2":e==="2"||e==="3"?"3":e==="danger"?"danger":e==="warning"?"warning":e==="success"?"success":e==="auto"?"1":e:"0"}function c(e,n){return n?typeof n=="object"?n:typeof e=="object"?n==="auto"?"0":n:n==="auto"?m(e):n:e}function v(e,n){return n?typeof n=="object"?n:n==="auto"?typeof e=="object"?"0":e:n:e}const d=({surface:e,children:n})=>u.jsx(t.Provider,{value:s({1:{surface:e}}),children:n}),g=e=>{const a=i.useContext(t)?.atVersion(1)??{surface:void 0},l=e?.surface!==void 0,r=e?.surface??e?.onSurface;return{surface:l?c(a.surface,r):v(a.surface,r)}};d.__docgenInfo={description:`Provider component that establishes the surface context for child components.
This allows components to adapt their styling based on their background surface.

Note: The surface value should already be resolved before passing to this provider.
Container components should use useSurface with the surface parameter.

@internal`,methods:[],displayName:"SurfaceProvider",props:{surface:{required:!0,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{d as S,g as u};
