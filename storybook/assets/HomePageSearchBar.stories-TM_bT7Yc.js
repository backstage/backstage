import{bQ as e,a4 as n}from"./iframe-DFSHFeCl.js";import{H as a,r as i}from"./plugin-B5gAMw6M.js";import{S as o}from"./Grid-Dmi5E4PF.js";import{O as c}from"./appWrappers-CoQ45x7B.js";import{m}from"./makeStyles--EHfQ_qo.js";import{s as p}from"./api-BKDj40YV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CRW5UUcO.js";import"./Plugin-C-WMs0fN.js";import"./componentData-BEtpqz7T.js";import"./useAnalytics-CCyVhjtr.js";import"./useApp-DuAavzIK.js";import"./useRouteRef-BOpfPCjp.js";import"./WebStorage-B9jzRESV.js";import"./useAsync-Bcmm5-c1.js";import"./useMountedState-C2HKs-XF.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BLDCE_Pq.js";import"./useIsomorphicLayoutEffect-D7DRw0UE.js";import"./BUIProvider-CON9_o4b.js";import"./BUIRoutingProvider-D9g8Wg3r.js";import"./openLink-BDUtlzhT.js";import"./useResolvedHref-CNXQcCp8.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
