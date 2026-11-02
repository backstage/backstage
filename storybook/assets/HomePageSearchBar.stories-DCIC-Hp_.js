import{j as e,a3 as n}from"./iframe-DvObL_em.js";import{H as a,r as i}from"./plugin-C1lmnkmr.js";import{S as o}from"./Grid-D0oIIaci.js";import{w as c}from"./appWrappers-gR2agPjp.js";import{m}from"./makeStyles-CUBlkZ58.js";import{s as p}from"./api-DyhUSvEH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CGIjQEre.js";import"./Plugin-BnIrIoL7.js";import"./componentData-B3frsaQo.js";import"./useAnalytics-Cik4L6Xq.js";import"./useApp-C8xACzk4.js";import"./useRouteRef-nSqCXu_w.js";import"./WebStorage-CADH-q5X.js";import"./useAsync-C_QuVvY4.js";import"./useMountedState-qWdGL57P.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DRY9ixeB.js";import"./useIsomorphicLayoutEffect-PWyqTlhF.js";import"./BUIProvider-AdcJPj66.js";import"./BUIRoutingProvider-FkpniH64.js";import"./openLink-Ba7f2eDn.js";import"./useResolvedHref-DnRnBf0l.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
