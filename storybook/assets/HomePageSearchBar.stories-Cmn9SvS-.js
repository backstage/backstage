import{j as e,a3 as n}from"./iframe-DxHtOo4h.js";import{H as a,r as i}from"./plugin-CgbKbXG7.js";import{S as o}from"./Grid-BZqH7GD7.js";import{w as c}from"./appWrappers-Do_ltPPK.js";import{m}from"./makeStyles-B7nUh3vz.js";import{s as p}from"./api-CF2jdlwq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bd9soCIz.js";import"./Plugin-FY1ekhEk.js";import"./componentData-BJZnL4EB.js";import"./useAnalytics-5JWmj_TX.js";import"./useApp-fIwTxcF-.js";import"./useRouteRef-BFCT2d4F.js";import"./WebStorage-Bl71G0K4.js";import"./useAsync-BDlFQEH_.js";import"./useMountedState-CCrts7qQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DHfEa6Sz.js";import"./useIsomorphicLayoutEffect-D-QjHN0c.js";import"./BUIProvider-CmywjT2L.js";import"./BUIRoutingProvider-BThV0IfX.js";import"./openLink-DpClGL1h.js";import"./useResolvedHref-DhHasAy4.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
