import{j as e,a3 as n}from"./iframe-D9zyyCLm.js";import{H as a,r as i}from"./plugin-BrS5HH3B.js";import{S as o}from"./Grid-BB8AJhQB.js";import{w as c}from"./appWrappers-Mm2hSPXH.js";import{m}from"./makeStyles-CWCwef5R.js";import{s as p}from"./api-BcooKewd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DG-30ZDX.js";import"./Plugin-LTeon7ny.js";import"./componentData-DbTi_SHb.js";import"./useAnalytics-b9lD6bMf.js";import"./useApp-D2m-Ae2p.js";import"./useRouteRef-B4urRvXS.js";import"./WebStorage-BGXKhQbc.js";import"./useAsync-DanSD5vu.js";import"./useMountedState-T1Hh3_OE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bcuqb2aR.js";import"./useIsomorphicLayoutEffect-x86gmjWj.js";import"./BUIProvider-CorbBPd2.js";import"./BUIRoutingProvider-CWnqyVtP.js";import"./openLink-Dq3aE_9q.js";import"./useResolvedHref-CJObg6YS.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
