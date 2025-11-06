import{j as e,T as n,m as i}from"./iframe-DKl1TaBY.js";import{H as a,r as c}from"./plugin-CNz7lisr.js";import{s as m}from"./api-CzWMH9sB.js";import{S as o}from"./Grid-DucnE1Qv.js";import{w as p}from"./appWrappers-CQMFW9f8.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D3KAHFPL.js";import"./Plugin-Cp-tNdu1.js";import"./componentData-C9VKpHEQ.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./useRouteRef-CjGG19qw.js";import"./index-CAizWZSO.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const k={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[m,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":c}})]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=i(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
