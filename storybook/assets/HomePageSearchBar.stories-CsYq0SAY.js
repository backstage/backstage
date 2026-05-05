import{j as e,a2 as n}from"./iframe-DWvOg1Nr.js";import{H as a,r as i}from"./plugin-n4xMQXR9.js";import{S as o}from"./Grid-Xzlg2O4n.js";import{w as c}from"./appWrappers-qsIe7tVM.js";import{m}from"./makeStyles-CHGG-m_x.js";import{s as p}from"./api-C_OdQe4o.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dxgn-S4P.js";import"./Plugin-DAgqnd1A.js";import"./componentData-DqnKbKJN.js";import"./useAnalytics-CLrtpPO4.js";import"./useApp-QYowGE2r.js";import"./useRouteRef-DCvRouNi.js";import"./WebStorage-DIHlPgXc.js";import"./useAsync-WwgC0jUx.js";import"./useMountedState--89EdGyj.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Dg71hkMM.js";import"./useIsomorphicLayoutEffect-CVgPRDzJ.js";import"./BUIProvider-B0EmIMVv.js";import"./openLink-l0pO1O-P.js";import"./useResolvedHref-BKS5TyZb.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
