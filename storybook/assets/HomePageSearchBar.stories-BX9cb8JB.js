import{j as e,a2 as n}from"./iframe-C8vBbMI-.js";import{H as a,r as i}from"./plugin-BpOoktbf.js";import{S as o}from"./Grid-DduoCecT.js";import{w as c}from"./appWrappers-DNGG9sUg.js";import{m}from"./makeStyles-DEhzw0UI.js";import{s as p}from"./api-CbmJOaWK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D7amwu8k.js";import"./Plugin-BAyN1Xxt.js";import"./componentData-DAGxZ2o0.js";import"./useAnalytics-DKfC2Yhe.js";import"./useApp-Cchg7qe1.js";import"./useRouteRef-B6mbdMu5.js";import"./WebStorage-Bp2sRg0r.js";import"./useAsync-4Fi35BbH.js";import"./useMountedState-L9pPr6Rc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DjzOt1cE.js";import"./useIsomorphicLayoutEffect-DUo-5b2e.js";import"./BUIProvider-CEL4NntB.js";import"./openLink-B9VHRTOW.js";import"./useResolvedHref-cJdDhzhd.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const N=["Default","CustomStyles"];export{s as CustomStyles,t as Default,N as __namedExportsOrder,E as default};
