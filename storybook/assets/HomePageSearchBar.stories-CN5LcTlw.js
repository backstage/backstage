import{j as e,W as n}from"./iframe-rmBlqmIJ.js";import{H as a,r as i}from"./plugin-DJMXfUMd.js";import{s as c}from"./api-CghtvCf8.js";import{S as o}from"./Grid-S-q4EpZp.js";import{m}from"./makeStyles-C7NHQIjx.js";import{w as p}from"./appWrappers-BOQqf5-Z.js";import"./preload-helper-PPVm8Dsz.js";import"./index-NmRlj3M3.js";import"./Plugin-An5QFUCi.js";import"./componentData-Dhr-NMCk.js";import"./useAnalytics-C7krV7MX.js";import"./useApp-DX7Pc2xI.js";import"./useRouteRef-D2dVPoHe.js";import"./index-BlsTvS7-.js";import"./useObservable-D5K0wiFW.js";import"./useIsomorphicLayoutEffect-BAPUKgGj.js";import"./useAsync-BNMgov-1.js";import"./useMountedState-ByDL7K8T.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const v={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[c,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const A=["Default","CustomStyles"];export{s as CustomStyles,t as Default,A as __namedExportsOrder,v as default};
