import{j as e,a3 as n}from"./iframe-S5OJNhaE.js";import{H as a,r as i}from"./plugin-CJsRC7jy.js";import{S as o}from"./Grid-DjboKT5l.js";import{w as c}from"./appWrappers-SDy2NDGJ.js";import{m}from"./makeStyles-D0gbbC8R.js";import{s as p}from"./api-8PK06xjS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DGY2ozNX.js";import"./Plugin-CsL0oejA.js";import"./componentData-CFVKQESe.js";import"./useAnalytics-a2pKeP17.js";import"./useApp-DxGdeyks.js";import"./useRouteRef-DMP-PUAT.js";import"./WebStorage-DGbeUCIJ.js";import"./useAsync-nDYm94Va.js";import"./useMountedState-BxmbnEIC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-3QRG-oq7.js";import"./useIsomorphicLayoutEffect-CT3OHBKv.js";import"./BUIProvider-CxyEA8gh.js";import"./BUIRoutingProvider-MbdU_jc-.js";import"./openLink-gCGEI6Hl.js";import"./useResolvedHref-D6pj4Xy7.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
