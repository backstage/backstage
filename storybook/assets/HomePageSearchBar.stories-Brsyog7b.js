import{j as e,a3 as n}from"./iframe-osqb7I7f.js";import{H as a,r as i}from"./plugin-s5SduQBV.js";import{S as o}from"./Grid-C2Kxiu2a.js";import{w as c}from"./appWrappers-DI8N-JVE.js";import{m}from"./makeStyles-B-29AVkS.js";import{s as p}from"./api-BjGc97zD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cz-AjUk3.js";import"./Plugin-CR3fsTgy.js";import"./componentData-BX7umHfe.js";import"./useAnalytics-tPbxjeba.js";import"./useApp-DYfjB2yk.js";import"./useRouteRef-CcCAWIyV.js";import"./WebStorage-rF0XWcnS.js";import"./useAsync-yJjelmkJ.js";import"./useMountedState-CQlD_3Nl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Gjo01P6Z.js";import"./useIsomorphicLayoutEffect-DV2J71uN.js";import"./BUIProvider-D_Y7cW6n.js";import"./BUIRoutingProvider-ByqLAZ_I.js";import"./openLink-Dy9KSOrl.js";import"./useResolvedHref-BAQDC_wh.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
