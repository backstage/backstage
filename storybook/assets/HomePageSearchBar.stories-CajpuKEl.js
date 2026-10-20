import{j as e,a3 as n}from"./iframe-B3Qnvxa_.js";import{H as a,r as i}from"./plugin-MJk_jKMW.js";import{S as o}from"./Grid-TGje1sD4.js";import{w as c}from"./appWrappers-DTzcXwWM.js";import{m}from"./makeStyles-CKJzIE9W.js";import{s as p}from"./api-Do2B7CBE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DHPL-u1I.js";import"./Plugin-Bj1xwtBi.js";import"./componentData-CEMmbnAK.js";import"./useAnalytics-9bqjDfWa.js";import"./useApp-D5j1Erf4.js";import"./useRouteRef-DoyMpY92.js";import"./WebStorage-Di2mbNC_.js";import"./useAsync-Dzwrgnru.js";import"./useMountedState-JU61B273.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-AkHQChQ4.js";import"./useIsomorphicLayoutEffect-rP0ApUIi.js";import"./BUIProvider-CVZylF-T.js";import"./BUIRoutingProvider-CBiNhqBQ.js";import"./openLink-DUBrf5Vo.js";import"./useResolvedHref-BHZgPwt2.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
