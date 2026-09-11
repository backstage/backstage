import{bQ as e,a4 as n}from"./iframe-DwtLqRd0.js";import{H as a,r as i}from"./plugin-CBpH64SA.js";import{S as o}from"./Grid-CYWjZ88i.js";import{O as c}from"./appWrappers-6k9AmxPn.js";import{m}from"./makeStyles-61D4HnMF.js";import{s as p}from"./api-DxNEVkKW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DrSI5jB5.js";import"./Plugin-Bv4fnmgI.js";import"./componentData-Cgv6y0Zt.js";import"./useAnalytics-DP-R2foX.js";import"./useApp-CwD5tnbo.js";import"./useRouteRef-B5ZPUVdA.js";import"./WebStorage-Das6G0h5.js";import"./useAsync-P5fwF-TJ.js";import"./useMountedState-BdNpbXH7.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-if6xlNcL.js";import"./useIsomorphicLayoutEffect-CclSZCNC.js";import"./BUIProvider-c6TORPmv.js";import"./BUIRoutingProvider-D8L55R8m.js";import"./openLink-Chp0fPN0.js";import"./useResolvedHref-B6eHfBkG.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
