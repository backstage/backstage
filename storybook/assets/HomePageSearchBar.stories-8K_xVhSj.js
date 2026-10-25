import{j as e,a3 as n}from"./iframe-CMSX-Slv.js";import{H as a,r as i}from"./plugin-2f-ev67w.js";import{S as o}from"./Grid-CftEnNEm.js";import{w as c}from"./appWrappers-CVSao9ZM.js";import{m}from"./makeStyles-C56sb6JC.js";import{s as p}from"./api-DxPdYrrE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BG8Llh7c.js";import"./Plugin-DJDHrf_u.js";import"./componentData-DvM2i4Kp.js";import"./useAnalytics-BQThuKWZ.js";import"./useApp-ghU1X1ft.js";import"./useRouteRef-Ck-5alzw.js";import"./WebStorage-C5-Lnuo3.js";import"./useAsync-aXM3lV21.js";import"./useMountedState-CRdqm6Ni.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DoFBgZRI.js";import"./useIsomorphicLayoutEffect-CbYSmtjY.js";import"./BUIProvider-rCuBO32v.js";import"./BUIRoutingProvider-CMtIo0Uo.js";import"./openLink-p0OhMCOD.js";import"./useResolvedHref-CvdgPikl.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
