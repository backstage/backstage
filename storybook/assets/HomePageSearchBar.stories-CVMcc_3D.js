import{j as e,a3 as n}from"./iframe-psIK5yLO.js";import{H as a,r as i}from"./plugin-CccI8srg.js";import{S as o}from"./Grid-CMGT3-M2.js";import{w as c}from"./appWrappers-D-NWaiz3.js";import{m}from"./makeStyles-BO5raylp.js";import{s as p}from"./api-BvqLUifP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DVgmHS_q.js";import"./Plugin-Cc_I9Ptk.js";import"./componentData-CxNu6_8q.js";import"./useAnalytics-DunOMgS-.js";import"./useApp-Dtg5HRbD.js";import"./useRouteRef-Ba9Wwey9.js";import"./WebStorage-D_BhlxFV.js";import"./useAsync-mn43h2uI.js";import"./useMountedState-JsdGtBh8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BiFXzlrm.js";import"./useIsomorphicLayoutEffect-Bv8sPo2x.js";import"./BUIProvider-C83dKFXg.js";import"./BUIRoutingProvider-DGp64BJg.js";import"./openLink-CZeZ1U9d.js";import"./useResolvedHref-D6pK9K8J.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
