import{bQ as e,a4 as n}from"./iframe-B771vieD.js";import{H as a,r as i}from"./plugin-C3vC5lYk.js";import{S as o}from"./Grid-CkxOXqgi.js";import{O as c}from"./appWrappers-D1IwQ-h2.js";import{m}from"./makeStyles-C1hpTmTF.js";import{s as p}from"./api-C9HDd0aR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B38jny47.js";import"./Plugin-B0Xdwx1X.js";import"./componentData-C_g83Z90.js";import"./useAnalytics-Di36h0wy.js";import"./useApp-CmxPLI0J.js";import"./useRouteRef-W2fREn2c.js";import"./WebStorage-BSrayqdC.js";import"./useAsync-BcBtnJm4.js";import"./useMountedState-dJd1Klgy.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D1IO1a8O.js";import"./useIsomorphicLayoutEffect-BHnU40rP.js";import"./BUIProvider-Bo_MB1ar.js";import"./BUIRoutingProvider-CA0Vr8wC.js";import"./openLink-AzCo47yl.js";import"./useResolvedHref-N95SPT_C.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
