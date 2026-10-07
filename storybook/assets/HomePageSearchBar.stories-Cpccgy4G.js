import{j as e,a3 as n}from"./iframe-WUTgIN9N.js";import{H as a,r as i}from"./plugin-3ubexZRM.js";import{S as o}from"./Grid-QAEhh-IU.js";import{w as c}from"./appWrappers-Bbe0n_Zp.js";import{m}from"./makeStyles-D1P9beTg.js";import{s as p}from"./api-BjbWyhwg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Lf4P6JPr.js";import"./Plugin-CMnDNdo9.js";import"./componentData-n4SXAURB.js";import"./useAnalytics-gQW0QBIW.js";import"./useApp-C9iKSsIv.js";import"./useRouteRef-QuyDC0sL.js";import"./WebStorage-BUgSkFbv.js";import"./useAsync-KKA-Wjg0.js";import"./useMountedState-hBsZdgf2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D0n64vxR.js";import"./useIsomorphicLayoutEffect-Ca8UfJIg.js";import"./BUIProvider-WuPWvIl5.js";import"./BUIRoutingProvider-CNPvymuD.js";import"./openLink-C4ChH1Hb.js";import"./useResolvedHref--v0iYvrv.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
