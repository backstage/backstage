import{j as e,W as n}from"./iframe-CTfOr1ix.js";import{H as a,r as i}from"./plugin-CTeSdQZ3.js";import{s as c}from"./api-CQ2dJml8.js";import{S as o}from"./Grid-6mM_q0n-.js";import{m}from"./makeStyles-1FwyOuiP.js";import{w as p}from"./appWrappers-DS_xPVdC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-wMewbaDE.js";import"./Plugin-BgOhi4BI.js";import"./componentData-CQMJYY4y.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";import"./useRouteRef-S5w5RoSG.js";import"./index-B-ObPmyF.js";import"./useObservable-D-HXaDcN.js";import"./useIsomorphicLayoutEffect-BN4bH0qe.js";import"./useAsync-B32B7Qp6.js";import"./useMountedState-g2Ku3pig.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const v={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[c,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
