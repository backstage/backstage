import{j as e,a3 as n}from"./iframe-D5t0zV2Z.js";import{H as a,r as i}from"./plugin-BzKXYwEp.js";import{S as o}from"./Grid-i35IH7WF.js";import{w as c}from"./appWrappers-BvGuXe8p.js";import{m}from"./makeStyles-C7L4K4uU.js";import{s as p}from"./api-D9Y4gEUt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-l7DXFTk3.js";import"./Plugin-0GVk6Imj.js";import"./componentData-BL5XaQ16.js";import"./useAnalytics-BxfmAkrD.js";import"./useApp-CSht05na.js";import"./useRouteRef-Be_pkKdk.js";import"./WebStorage-BOq2Mr3_.js";import"./useAsync-OcUXg1oi.js";import"./useMountedState-CfWlui47.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DmLtxgue.js";import"./useIsomorphicLayoutEffect-CdE_6YsQ.js";import"./BUIProvider-1V_oyFR4.js";import"./BUIRoutingProvider-Bi_Kr0PI.js";import"./openLink-DJ_oJLh5.js";import"./useResolvedHref-BwjjIWjA.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
