import{j as e,W as n}from"./iframe-ByBrTvma.js";import{H as a,r as i}from"./plugin-CwF9-oP3.js";import{s as c}from"./api-UBCebQ5l.js";import{S as o}from"./Grid-CVJ59jxc.js";import{m}from"./makeStyles-DbNf7az6.js";import{w as p}from"./appWrappers-DEhvokBS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-OjFV48uN.js";import"./Plugin-DZyQaL-e.js";import"./componentData-CUWvUlYo.js";import"./useAnalytics-BFlIYKys.js";import"./useApp-BryTheKO.js";import"./useRouteRef-5-P7pYbC.js";import"./index-gUHaPa4H.js";import"./useObservable-Ceq4tTAb.js";import"./useIsomorphicLayoutEffect--FgWIbd6.js";import"./useAsync-Coek-nsh.js";import"./useMountedState-ClRjsrJA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const v={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[c,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
