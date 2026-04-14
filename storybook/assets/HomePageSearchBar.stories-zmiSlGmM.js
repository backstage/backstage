import{j as e,$ as n}from"./iframe-KINrIo_f.js";import{H as a,r as i}from"./plugin-DfNor6nX.js";import{S as o}from"./Grid-FoW9JHab.js";import{w as c}from"./appWrappers-z6NxJqlC.js";import{m}from"./makeStyles-Br0G-hkA.js";import{s as p}from"./api-DrXoM2Fb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CNs_elnA.js";import"./Plugin-B2KqZHWe.js";import"./componentData-qZciE7mF.js";import"./useAnalytics-Cjgpjhm8.js";import"./useApp-C5R7puQC.js";import"./useRouteRef-BjpYbkhm.js";import"./WebStorage-B6vFWMkV.js";import"./useAsync-DngpNpKD.js";import"./useMountedState-CjwlO_ha.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Ck2mvxcb.js";import"./useIsomorphicLayoutEffect-72DB9J2o.js";import"./BUIProvider-Ciu3w9NY.js";import"./openLink-BCV1Ju3v.js";const D={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const E=["Default","CustomStyles"];export{s as CustomStyles,t as Default,E as __namedExportsOrder,D as default};
