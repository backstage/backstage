import{bQ as e,a4 as n}from"./iframe-DXdR4xPj.js";import{H as a,r as i}from"./plugin-Dnp0re2l.js";import{S as o}from"./Grid-DrAuN9Lo.js";import{O as c}from"./appWrappers-CEl3ywVn.js";import{m}from"./makeStyles-BSWJde_H.js";import{s as p}from"./api-C2sdP6MI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D-4OBk9P.js";import"./Plugin-BfH0A7QP.js";import"./componentData-CHj3LiZV.js";import"./useAnalytics-Bc97N_iw.js";import"./useApp-cePut29r.js";import"./useRouteRef-B6gXfved.js";import"./WebStorage-DQ8VF5en.js";import"./useAsync-BqpLlOup.js";import"./useMountedState-ONEV228w.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BS8_YX0o.js";import"./useIsomorphicLayoutEffect-Ch41KCBC.js";import"./BUIProvider-3mC0dqi4.js";import"./BUIRoutingProvider-Cv_U09wD.js";import"./openLink-C1Sid2pZ.js";import"./useResolvedHref-CWLs1pfc.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
