import{bQ as e,a4 as n}from"./iframe-D3gHomOk.js";import{H as a,r as i}from"./plugin-ChF1kfHd.js";import{S as o}from"./Grid-CyyBT709.js";import{O as c}from"./appWrappers-H0a9YQ-l.js";import{m}from"./makeStyles-T-ZYABdB.js";import{s as p}from"./api-CSqAMwdU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-5OyBKTsY.js";import"./Plugin-DECEvu0s.js";import"./componentData-BrD0tNsD.js";import"./useAnalytics-l6aR9y4o.js";import"./useApp-MRQbwWB5.js";import"./useRouteRef-CGGg16P4.js";import"./WebStorage-Cb28cuwL.js";import"./useAsync-B81SIAob.js";import"./useMountedState-D4RFf6EC.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Cla-FsHD.js";import"./useIsomorphicLayoutEffect-DONxPHXM.js";import"./BUIProvider-Bxr4G_Rv.js";import"./BUIRoutingProvider-ClLZP9qs.js";import"./openLink-BpYvnjEr.js";import"./useResolvedHref-F6RORdbO.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
