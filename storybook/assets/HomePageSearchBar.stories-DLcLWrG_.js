import{j as e,a2 as n}from"./iframe-CBMR_Zns.js";import{H as a,r as i}from"./plugin-DJgunlkL.js";import{S as o}from"./Grid-Dj5TTCpv.js";import{w as c}from"./appWrappers-BnfNs8pT.js";import{m}from"./makeStyles-sF8PfItD.js";import{s as p}from"./api-1WyMO0Wu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-4zsJGZ2G.js";import"./Plugin-C2cmEbwE.js";import"./componentData-DtiW7rWZ.js";import"./useAnalytics-2o7uH7x2.js";import"./useApp-CBwGPM4M.js";import"./useRouteRef-DFeh6mKR.js";import"./WebStorage-BnEnooll.js";import"./useAsync-DfHFGo6-.js";import"./useMountedState-CYyJnhmf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DMqrvXE7.js";import"./useIsomorphicLayoutEffect-MoBArEH8.js";import"./BUIProvider-CrKTt50y.js";import"./openLink-ChAauiNp.js";import"./useResolvedHref-CZHOSwzU.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
