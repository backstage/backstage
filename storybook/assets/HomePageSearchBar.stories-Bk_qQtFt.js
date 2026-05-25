import{j as e,a2 as n}from"./iframe-C0T-wj8W.js";import{H as a,r as i}from"./plugin-D7cp4cOJ.js";import{S as o}from"./Grid-Kd3bNwE8.js";import{w as c}from"./appWrappers-CriX5g6D.js";import{m}from"./makeStyles-DViRTVia.js";import{s as p}from"./api-DWyDta_6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Csb278mP.js";import"./Plugin-uJj8IM1L.js";import"./componentData-Wenc7sxq.js";import"./useAnalytics-C8hlcdRX.js";import"./useApp-CHDrtVuY.js";import"./useRouteRef-CNNtqCdh.js";import"./WebStorage-wXFQu-Oc.js";import"./useAsync-PxR9m19r.js";import"./useMountedState-CFrOHiDa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CwTrF2-_.js";import"./useIsomorphicLayoutEffect-DUd4iW2_.js";import"./BUIProvider-BysIBW5M.js";import"./openLink-LrDtNDVV.js";import"./useResolvedHref-Dgg1vi6i.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
