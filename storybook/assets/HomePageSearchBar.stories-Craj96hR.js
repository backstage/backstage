import{bQ as e,a4 as n}from"./iframe-BiC6vzfc.js";import{H as a,r as i}from"./plugin-Cd-WS6dq.js";import{S as o}from"./Grid-5kX5iYpE.js";import{O as c}from"./appWrappers-D9Cr-qww.js";import{m}from"./makeStyles-BTRKbQbn.js";import{s as p}from"./api-C7zv9PAa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CxvBrRzT.js";import"./Plugin-GMqqlhqe.js";import"./componentData-BSbf9b0a.js";import"./useAnalytics-CWeTU5_6.js";import"./useApp-CsAmf1u2.js";import"./useRouteRef-BkmsmyAx.js";import"./WebStorage-Cp2ehJip.js";import"./useAsync-BfvsCM6Z.js";import"./useMountedState-rwLvoT14.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CNB7CHhj.js";import"./useIsomorphicLayoutEffect-VRDt432r.js";import"./BUIProvider-DEMxJ951.js";import"./BUIRoutingProvider-ht1fdH5F.js";import"./openLink-fglnGFM4.js";import"./useResolvedHref-G7FW9UOs.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
