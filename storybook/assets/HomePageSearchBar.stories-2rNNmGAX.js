import{j as e,a3 as n}from"./iframe-BIybnMXI.js";import{H as a,r as i}from"./plugin-BLqtIoJE.js";import{S as o}from"./Grid-CKJ_Bjce.js";import{w as c}from"./appWrappers-CWLlPpC1.js";import{m}from"./makeStyles-cGXTSjHb.js";import{s as p}from"./api-BeLm5gjz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dx0u7ccx.js";import"./Plugin-ByDFrRuu.js";import"./componentData-VudDzjAh.js";import"./useAnalytics-Cee1mTCP.js";import"./useApp-B-DAdzWT.js";import"./useRouteRef-BP3dw6pm.js";import"./WebStorage-Cv07gffl.js";import"./useAsync-35LYdSE_.js";import"./useMountedState-Dhu05aIm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BlFTL7mD.js";import"./useIsomorphicLayoutEffect-CCl5E4y2.js";import"./BUIProvider-BGFGf2ST.js";import"./BUIRoutingProvider-CnIqwql2.js";import"./openLink-_nIoHyS5.js";import"./useResolvedHref-Cp7X7JN9.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
