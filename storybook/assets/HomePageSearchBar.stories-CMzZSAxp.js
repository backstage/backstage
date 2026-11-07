import{j as e,a3 as n}from"./iframe-DXL2wfUr.js";import{H as a,r as i}from"./plugin-BwPclw6G.js";import{S as o}from"./Grid-BXM3QonJ.js";import{w as c}from"./appWrappers-DWsi2PsB.js";import{m}from"./makeStyles-dq_iUTd0.js";import{s as p}from"./api-DY6neQmk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-xufSN3XE.js";import"./Plugin-Cc0-ogKV.js";import"./componentData-CtlDd_rh.js";import"./useAnalytics-BPKTxT6C.js";import"./useApp-B5hGsOxI.js";import"./useRouteRef-Bpqe7aet.js";import"./WebStorage-tN-B8_3i.js";import"./useAsync-Cd65YFwz.js";import"./useMountedState-CQD-rq-n.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cvw6es2l.js";import"./useIsomorphicLayoutEffect-DjbJNnV2.js";import"./BUIProvider-BLX9Ljti.js";import"./BUIRoutingProvider-DnSIApiV.js";import"./openLink-CjcP3ChZ.js";import"./useResolvedHref-C3ATKrxL.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
