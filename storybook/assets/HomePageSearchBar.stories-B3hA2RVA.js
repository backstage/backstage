import{bQ as e,a4 as n}from"./iframe-Bkld27Xv.js";import{H as a,r as i}from"./plugin-BeMHPftR.js";import{S as o}from"./Grid-NPf6_mtF.js";import{O as c}from"./appWrappers-Kk9K4UG1.js";import{m}from"./makeStyles-c8tM0-Si.js";import{s as p}from"./api-TH6zqA1p.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CqBLEy_E.js";import"./Plugin-DTFe5i56.js";import"./componentData-2LorLZQO.js";import"./useAnalytics-DgzNfNA8.js";import"./useApp-BeXbzCkx.js";import"./useRouteRef-YwVR45xu.js";import"./WebStorage-dVVBLCSt.js";import"./useAsync-Ciu42EII.js";import"./useMountedState-tSzLaBrI.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-KL69k-0O.js";import"./useIsomorphicLayoutEffect-2h0McDmQ.js";import"./BUIProvider-CZxZ_ya5.js";import"./BUIRoutingProvider-kRMOb9Tv.js";import"./openLink-Dls5t0TL.js";import"./useResolvedHref-69pkV9Nv.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
