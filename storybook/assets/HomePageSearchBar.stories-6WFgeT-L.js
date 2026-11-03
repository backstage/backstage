import{j as e,a3 as n}from"./iframe-BteMx7zj.js";import{H as a,r as i}from"./plugin-DD_0OVHL.js";import{S as o}from"./Grid-D5ZyNHnh.js";import{w as c}from"./appWrappers-BtBpHXg5.js";import{m}from"./makeStyles-DGUes2su.js";import{s as p}from"./api-BjMO7ARA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-7LSu150P.js";import"./Plugin-ILh5X73T.js";import"./componentData-DQx1Zps_.js";import"./useAnalytics-CzrCeQK4.js";import"./useApp-CQY1dbvI.js";import"./useRouteRef-B7F6kW1A.js";import"./WebStorage-2yAAATz5.js";import"./useAsync-DyWgphio.js";import"./useMountedState-CHelMk4j.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B1KyI6ep.js";import"./useIsomorphicLayoutEffect-B4k77VyC.js";import"./BUIProvider-D3_d0bOb.js";import"./BUIRoutingProvider-CPad7EDH.js";import"./openLink-8VSUUPMi.js";import"./useResolvedHref-DazIgbZb.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
