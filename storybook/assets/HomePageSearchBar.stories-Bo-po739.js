import{j as e,a3 as n}from"./iframe-DxBRWUiK.js";import{H as a,r as i}from"./plugin-by2GeaR8.js";import{S as o}from"./Grid-Dnrsaaez.js";import{w as c}from"./appWrappers-DLFuy7KW.js";import{m}from"./makeStyles-CpnAmrz_.js";import{s as p}from"./api-BNflrItp.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DOrqo0G8.js";import"./Plugin-D5m3DAxi.js";import"./componentData-CkAmMJOv.js";import"./useAnalytics-DhjjGYXj.js";import"./useApp-nhNhp-L5.js";import"./useRouteRef-CML3kP8F.js";import"./WebStorage-sckTpqNX.js";import"./useAsync-CltTyTRu.js";import"./useMountedState-DRsk22-r.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BQCoeNMP.js";import"./useIsomorphicLayoutEffect-BE3G-SCC.js";import"./BUIProvider-BTuxSVSJ.js";import"./BUIRoutingProvider-ouU5VIyg.js";import"./openLink-a1B1hwMM.js";import"./useResolvedHref-CDpKBnHn.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
