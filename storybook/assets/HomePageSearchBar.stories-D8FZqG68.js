import{bQ as e,a4 as n}from"./iframe-CZAQRplz.js";import{H as a,r as i}from"./plugin-Cd2dupwW.js";import{S as o}from"./Grid-DzCeEWhe.js";import{O as c}from"./appWrappers-DHMn8qWD.js";import{m}from"./makeStyles-Cb2cCzWc.js";import{s as p}from"./api-BLooGu2X.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CS1x3byt.js";import"./Plugin-DnL3C0EB.js";import"./componentData-DPmdG49O.js";import"./useAnalytics-BlCfiJ5k.js";import"./useApp-BwYv7u9J.js";import"./useRouteRef-CfSH58z8.js";import"./WebStorage-Cx4cDOuP.js";import"./useAsync-BBMi03Xp.js";import"./useMountedState-CdIJTKGb.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_FYj-VW.js";import"./useIsomorphicLayoutEffect-BD9JGZ-e.js";import"./BUIProvider-DYyFDI-V.js";import"./BUIRoutingProvider-C_mkOCzL.js";import"./openLink-CS4qCOfy.js";import"./useResolvedHref-Ddyd4aYm.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
