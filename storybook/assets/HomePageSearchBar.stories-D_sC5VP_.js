import{j as e,a3 as n}from"./iframe-DsaViRt6.js";import{H as a,r as i}from"./plugin-C5WyOvDM.js";import{S as o}from"./Grid-8AdasDhF.js";import{w as c}from"./appWrappers-4T5Umbw4.js";import{m}from"./makeStyles-DomhxC8K.js";import{s as p}from"./api-CRhHQ3kI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DoO5Oh_i.js";import"./Plugin-BzAwdV0K.js";import"./componentData-B2aBErUu.js";import"./useAnalytics-C8e92oTN.js";import"./useApp-Fb2uCB2O.js";import"./useRouteRef-BDc5HK_0.js";import"./WebStorage-CNdBqC6r.js";import"./useAsync-1_mPOrBB.js";import"./useMountedState-tMdzOAMm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D37lPVdM.js";import"./useIsomorphicLayoutEffect-ehheGkQi.js";import"./BUIProvider-CSv_q2aR.js";import"./BUIRoutingProvider-80Q71Qhv.js";import"./openLink-DOqnQA7B.js";import"./useResolvedHref-BnrY4UN4.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
