import{j as e,a3 as n}from"./iframe-piw0-GWS.js";import{H as a,r as i}from"./plugin-BoBTQWJI.js";import{S as o}from"./Grid-Bua32Pkj.js";import{w as c}from"./appWrappers--sopDpeI.js";import{m}from"./makeStyles-DDl_fC1G.js";import{s as p}from"./api-Cw9sRq22.js";import"./preload-helper-PPVm8Dsz.js";import"./index-spGXB8_v.js";import"./Plugin-BwcUJjBy.js";import"./componentData-CIdyYHhH.js";import"./useAnalytics-CWHO13NO.js";import"./useApp-Buw1Idw2.js";import"./useRouteRef-BDpdho-2.js";import"./WebStorage-CL7RPLWP.js";import"./useAsync-DQ0Nkrxq.js";import"./useMountedState-CTvcjAp4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CKCxz5MB.js";import"./useIsomorphicLayoutEffect-C-lb1VY4.js";import"./BUIProvider-avY07MpV.js";import"./BUIRoutingProvider-DGNvCocA.js";import"./openLink-BiQlZAwx.js";import"./useResolvedHref-RozAxOr0.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
