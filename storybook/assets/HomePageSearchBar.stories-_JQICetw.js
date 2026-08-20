import{bR as e,a5 as n}from"./iframe-BHoENCVc.js";import{H as a,r as i}from"./plugin-CFZ3Q1ue.js";import{S as o}from"./Grid-DQ6GJWoC.js";import{O as c}from"./appWrappers-Bfq9ls44.js";import{m}from"./makeStyles-DPkHg9n9.js";import{s as p}from"./api-C4r6jMvM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C1Mv8UC5.js";import"./Plugin-UlOKnMmC.js";import"./componentData-BFK1FCBi.js";import"./useAnalytics-Cx5c0pM3.js";import"./useApp-D78Q1Dx1.js";import"./useRouteRef-B9PFWjwA.js";import"./WebStorage-DQiA-S4e.js";import"./useAsync-DaAAM54v.js";import"./useMountedState-CS6T7kHD.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CYkRaHNa.js";import"./useIsomorphicLayoutEffect-BQX4Dz1t.js";import"./BUIProvider-BqojK_vt.js";import"./openLink-DZP0UHC7.js";import"./useResolvedHref-KjDbaJ0G.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
