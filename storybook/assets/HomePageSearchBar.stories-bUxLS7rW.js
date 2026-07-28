import{bR as e,a5 as n}from"./iframe-X5mwL4tp.js";import{H as a,r as i}from"./plugin-DgWGrZzx.js";import{S as o}from"./Grid-DtctBXEt.js";import{O as c}from"./appWrappers-Cdoe-OPD.js";import{m}from"./makeStyles-CTt1csqa.js";import{s as p}from"./api-B5_0-DSn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzUB3tbj.js";import"./Plugin-4AvN6KCK.js";import"./componentData-DOpgRNZ3.js";import"./useAnalytics-M9bf2v34.js";import"./useApp-B4BHpcqM.js";import"./useRouteRef-CwEa8AkF.js";import"./WebStorage-B0rG59bB.js";import"./useAsync-cHnixGLh.js";import"./useMountedState-9MODhG_9.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CskUFJ-y.js";import"./useIsomorphicLayoutEffect-OSmP2MG9.js";import"./BUIProvider-gHi16S2c.js";import"./openLink-iaf6h5Vg.js";import"./useResolvedHref-v0hr4wbk.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
