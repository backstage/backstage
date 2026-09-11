import{bQ as e,a4 as n}from"./iframe-DgMUslzK.js";import{H as a,r as i}from"./plugin-BpplsLM2.js";import{S as o}from"./Grid-aIkVCW8j.js";import{O as c}from"./appWrappers-DnGg_1kd.js";import{m}from"./makeStyles-Df7PmhVI.js";import{s as p}from"./api-Df0Dc0k4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-acnEIQhM.js";import"./Plugin-D-2FMaCh.js";import"./componentData-Nl-aHIr2.js";import"./useAnalytics-BFdM291c.js";import"./useApp-KaRpWMSR.js";import"./useRouteRef-MZ_dYcf2.js";import"./WebStorage-BRQPpy7S.js";import"./useAsync-BxjAJpYl.js";import"./useMountedState-C1sLF66g.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DvaPDP7-.js";import"./useIsomorphicLayoutEffect-jGhVHM4W.js";import"./BUIProvider-GUdtKeqf.js";import"./BUIRoutingProvider-BC2UkotL.js";import"./openLink-CV_TcEkD.js";import"./useResolvedHref-BodXPRI9.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
