import{bR as e,a5 as n}from"./iframe-DQtIir6_.js";import{H as a,r as i}from"./plugin-CidC7xak.js";import{S as o}from"./Grid-DtwO6FOq.js";import{O as c}from"./appWrappers-QWvw0PME.js";import{m}from"./makeStyles-BGUJ1R1k.js";import{s as p}from"./api-C0Hpf04Q.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BBecJEcH.js";import"./Plugin-hz3JFJfH.js";import"./componentData-DhuZXKP2.js";import"./useAnalytics-Nt1lbfmh.js";import"./useApp-D0OeqPVb.js";import"./useRouteRef-CogNHl6p.js";import"./WebStorage-DaKYb1Rr.js";import"./useAsync-B2B92X5M.js";import"./useMountedState-DRMZFfHM.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-PNrdDs4m.js";import"./useIsomorphicLayoutEffect-Dy6XiFEk.js";import"./BUIProvider-BFppeoJz.js";import"./openLink-DLb8P_7j.js";import"./useResolvedHref-DS33idVI.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
