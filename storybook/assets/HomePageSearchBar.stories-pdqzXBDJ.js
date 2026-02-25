import{j as e,W as n}from"./iframe-DcAecAau.js";import{H as a,r as i}from"./plugin-D4_DD9s9.js";import{s as c}from"./api-GaFvy9o-.js";import{S as o}from"./Grid-DVeyPTP6.js";import{m}from"./makeStyles-Cdr7b8Bk.js";import{w as p}from"./appWrappers-adu5cj2R.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_in6OtC.js";import"./Plugin-BGHfKivX.js";import"./componentData-BsN32ToI.js";import"./useAnalytics-DH1T3srq.js";import"./useApp-wY_LWfHh.js";import"./useRouteRef-Bhs9MXSy.js";import"./index-CNtntR7q.js";import"./useObservable-CCLSm_z5.js";import"./useIsomorphicLayoutEffect-BrQ2srDd.js";import"./useAsync-Caf5A2Bw.js";import"./useMountedState-CQNruCwR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const v={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[c,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const A=["Default","CustomStyles"];export{s as CustomStyles,t as Default,A as __namedExportsOrder,v as default};
