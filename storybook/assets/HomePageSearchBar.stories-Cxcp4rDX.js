import{bQ as e,a4 as n}from"./iframe-CJeP2vvm.js";import{H as a,r as i}from"./plugin-DUv1W_He.js";import{S as o}from"./Grid-udHwzQNb.js";import{O as c}from"./appWrappers-D5u8a8ls.js";import{m}from"./makeStyles-CtzsXOCL.js";import{s as p}from"./api-CfEdcScA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-_d0g1NlT.js";import"./Plugin-oIYVuWiP.js";import"./componentData-Dr1PaZhI.js";import"./useAnalytics-De2cbPtm.js";import"./useApp-CK6pVRGl.js";import"./useRouteRef-yMd4s_24.js";import"./WebStorage-CTW9J7rK.js";import"./useAsync-CUJKoC7E.js";import"./useMountedState-BT60qhs5.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BrAie7q7.js";import"./useIsomorphicLayoutEffect-CyOi9XEE.js";import"./BUIProvider-Di2647ue.js";import"./BUIRoutingProvider-B_ktoSaA.js";import"./openLink-Dw-jVqrV.js";import"./useResolvedHref-DW2cHm9P.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
