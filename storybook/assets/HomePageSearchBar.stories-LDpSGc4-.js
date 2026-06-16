import{bR as e,a5 as n}from"./iframe-Dv_LOz74.js";import{H as a,r as i}from"./plugin-BJVoQEzM.js";import{S as o}from"./Grid-CVdaifsV.js";import{O as c}from"./appWrappers-CmEcUByL.js";import{m}from"./makeStyles-Balw57Mg.js";import{s as p}from"./api-B7hXPLBU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B9h7V99y.js";import"./Plugin-D1OvUBMM.js";import"./componentData-BQTeh_4N.js";import"./useAnalytics-BQ1Ntni6.js";import"./useApp-Cy2_bCrQ.js";import"./useRouteRef-1pbbofs0.js";import"./WebStorage-rx70a8xr.js";import"./useAsync-CcQw0pT5.js";import"./useMountedState-DpKKYMpO.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CF22uZMb.js";import"./useIsomorphicLayoutEffect-vDhIERA2.js";import"./BUIProvider-ClTaX_z6.js";import"./openLink-CPEyVxLu.js";import"./useResolvedHref-B4uHO-JA.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
