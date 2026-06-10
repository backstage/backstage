import{bR as e,a5 as n}from"./iframe-C0kJxuo3.js";import{H as a,r as i}from"./plugin-BlWJ1aAr.js";import{S as o}from"./Grid-C-s0xDvK.js";import{O as c}from"./appWrappers-DqfuR-C8.js";import{m}from"./makeStyles-D5-PJbNp.js";import{s as p}from"./api-CGnsyOtx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C8Ow8SSa.js";import"./Plugin-B3Qpr9A4.js";import"./componentData-aev9F6Z-.js";import"./useAnalytics-X-Bs5xc4.js";import"./useApp-CXLNLZbd.js";import"./useRouteRef-avp4y8TI.js";import"./WebStorage-CXEzm-39.js";import"./useAsync-DtKVmQXw.js";import"./useMountedState-CiDqhiaq.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-WinG3YAH.js";import"./useIsomorphicLayoutEffect-Dmwd1vyk.js";import"./BUIProvider-CwKEQyi-.js";import"./openLink-DDhi7ntb.js";import"./useResolvedHref-Cysl8ASX.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
