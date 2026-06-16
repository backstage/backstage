import{bR as e,a5 as n}from"./iframe-Bm5ba6Eo.js";import{H as a,r as i}from"./plugin-D32f2nWs.js";import{S as o}from"./Grid-2YxRqddS.js";import{O as c}from"./appWrappers-CjN0uS8o.js";import{m}from"./makeStyles-BxPw9vCe.js";import{s as p}from"./api-6tYSjb2W.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DFYQHB0n.js";import"./Plugin-DktZ4BGz.js";import"./componentData-VX6GSl-M.js";import"./useAnalytics-BQdStjBt.js";import"./useApp-kMVg8txh.js";import"./useRouteRef-B5wYKb_5.js";import"./WebStorage-Ddi_3Tst.js";import"./useAsync-BFTdLWGt.js";import"./useMountedState-CX6Pdejq.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CzA18W9B.js";import"./useIsomorphicLayoutEffect-ChAZlZKa.js";import"./BUIProvider-BToDF3TK.js";import"./openLink-B3PKQziN.js";import"./useResolvedHref-DYKBvNag.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
