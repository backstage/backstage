import{j as e,a2 as n}from"./iframe-BOELprFv.js";import{H as a,r as i}from"./plugin-BpS2NmNQ.js";import{S as o}from"./Grid-CH5PqTNF.js";import{w as c}from"./appWrappers-CEl2Ow7o.js";import{m}from"./makeStyles-CSWS6G8b.js";import{s as p}from"./api-VTpynOT_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B2u1vAKH.js";import"./Plugin-CSZJYMuj.js";import"./componentData-DXRZVCfF.js";import"./useAnalytics-BJhOaRVB.js";import"./useApp-7Kwzc3rd.js";import"./useRouteRef-CcqJk9jr.js";import"./WebStorage-Ck90zCQN.js";import"./useAsync-DhMveIGN.js";import"./useMountedState-B_d8GdoW.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CDnTt6Oa.js";import"./useIsomorphicLayoutEffect-DcG3e63B.js";import"./BUIProvider-BVnThpam.js";import"./openLink-OWDAQw2O.js";import"./useResolvedHref-BWB2xz1Y.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
