import{j as e,Z as n}from"./iframe-DEPu6gb6.js";import{H as a,r as i}from"./plugin-DlaGvYwn.js";import{s as c}from"./api-B8NpRCgE.js";import{S as o}from"./Grid-B4jZTMCZ.js";import{m}from"./makeStyles-DmiRwbC-.js";import{w as p}from"./appWrappers-rKWuTpZr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-uxg9XexB.js";import"./Plugin-CFK_elVD.js";import"./componentData-D234a4EC.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./useRouteRef-CsJkSokk.js";import"./index-Dne3y8qR.js";import"./useObservable-BFSVE3K_.js";import"./useIsomorphicLayoutEffect-OCYqdIcN.js";import"./useAsync-CXqm1YlW.js";import"./useMountedState-Bp82S8Hy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const v={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[c,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
