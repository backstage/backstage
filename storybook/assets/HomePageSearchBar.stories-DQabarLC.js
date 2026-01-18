import{j as e,T as n,m as i}from"./iframe-Yl0Qc67S.js";import{H as a,r as c}from"./plugin-TzNuCugm.js";import{s as m}from"./api-TiC-QtXP.js";import{S as o}from"./Grid-BoLsaJTc.js";import{w as p}from"./appWrappers-CnXqdPEu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B7-flUez.js";import"./Plugin-Beh3pv9A.js";import"./componentData-D8eoWRR-.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./useRouteRef-DxCJ4QuA.js";import"./index-CuRibKaG.js";import"./useObservable-DO3JHHHA.js";import"./useIsomorphicLayoutEffect-BgwaU1Zu.js";import"./useAsync-HjbYn2WS.js";import"./useMountedState-B1Psi6MC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const k={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[m,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":c}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=i(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const v=["Default","CustomStyles"];export{s as CustomStyles,t as Default,v as __namedExportsOrder,k as default};
