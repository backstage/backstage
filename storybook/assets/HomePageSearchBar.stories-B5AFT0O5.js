import{j as e,U as n,m as i}from"./iframe-CDQkRPtg.js";import{H as a,r as c}from"./plugin-Bv-eAaz3.js";import{s as m}from"./api-BzNEOoum.js";import{S as o}from"./Grid-CLxLLrBH.js";import{w as p}from"./appWrappers-CE0QY808.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6tZq3CL.js";import"./Plugin-7Q4zKQYi.js";import"./componentData-DYzzNs7d.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./useRouteRef-BSUaPuHo.js";import"./index-SymPTtRB.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const k={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[m,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":c}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=i(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar placeholder="Search" />
      </Grid>
    </Grid>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar classes={{
        root: classes.searchBar
      }} InputProps={{
        classes: {
          notchedOutline: classes.searchBarOutline
        }
      }} placeholder="Search" />
      </Grid>
    </Grid>;
}`,...s.parameters?.docs?.source}}};const v=["Default","CustomStyles"];export{s as CustomStyles,t as Default,v as __namedExportsOrder,k as default};
