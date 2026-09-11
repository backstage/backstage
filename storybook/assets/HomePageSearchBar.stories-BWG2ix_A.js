import{bQ as e,a4 as n}from"./iframe-JPiukB_R.js";import{H as a,r as i}from"./plugin-CSIUjMNa.js";import{S as o}from"./Grid-CNTu3jbM.js";import{O as c}from"./appWrappers-CIJES5cn.js";import{m}from"./makeStyles-CRHqG-EO.js";import{s as p}from"./api-Dnl55U7v.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CiLfVEgn.js";import"./Plugin-CSpq1331.js";import"./componentData-Bmd6ICL1.js";import"./useAnalytics-D8KrhC1p.js";import"./useApp-XQFXwPZE.js";import"./useRouteRef-B3KEyANy.js";import"./WebStorage-BeyKAHX6.js";import"./useAsync-Dxe8QY4C.js";import"./useMountedState-Do2NdkuI.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Bpb3Dkjw.js";import"./useIsomorphicLayoutEffect-Bt_JK7Bt.js";import"./BUIProvider-DNlcrhsv.js";import"./BUIRoutingProvider-BiCU-bXq.js";import"./openLink-0QZlDlxj.js";import"./useResolvedHref--qUd8mWw.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
