import{j as e,a3 as n}from"./iframe-GY9q4FO8.js";import{H as a,r as i}from"./plugin-pkyhudUQ.js";import{S as o}from"./Grid-B0Qn3Dnm.js";import{w as c}from"./appWrappers-abPoRayI.js";import{m}from"./makeStyles-2U49SRly.js";import{s as p}from"./api-B1ZAIvuT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-cHkHBbTZ.js";import"./Plugin-Bm6diPSA.js";import"./componentData-DBWoKExG.js";import"./useAnalytics-ChuvGTuC.js";import"./useApp-KPq2D3WO.js";import"./useRouteRef-Df-4BPXn.js";import"./WebStorage-B4wqdseN.js";import"./useAsync-Dcd2mgGY.js";import"./useMountedState-Dc2o9XUu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cmm3TayF.js";import"./useIsomorphicLayoutEffect-muWHuJxm.js";import"./BUIProvider-CuGVHqZV.js";import"./BUIRoutingProvider-Jw2VtAIF.js";import"./openLink-CFz-JK3Y.js";import"./useResolvedHref-DHULiug-.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const T=["Default","CustomStyles"];export{s as CustomStyles,t as Default,T as __namedExportsOrder,N as default};
