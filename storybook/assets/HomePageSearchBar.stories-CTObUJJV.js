import{bQ as e,a4 as n}from"./iframe-Di5Wv8w_.js";import{H as a,r as i}from"./plugin-Ba1-0-mL.js";import{S as o}from"./Grid-D2BXyWtR.js";import{O as c}from"./appWrappers-CMr_hN3J.js";import{m}from"./makeStyles-D-4gmWAY.js";import{s as p}from"./api-sFd1mE6G.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DlmrnHSY.js";import"./Plugin-mvxujrYQ.js";import"./componentData-DrgMeFFe.js";import"./useAnalytics-B3tqbWl4.js";import"./useApp-WmaZUnnG.js";import"./useRouteRef-D3v5ZTU6.js";import"./WebStorage-BtLuZibV.js";import"./useAsync-BD13rqvr.js";import"./useMountedState-BBb1bjBJ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Dk8LjG0k.js";import"./useIsomorphicLayoutEffect-B-vw5MeX.js";import"./BUIProvider-DydDATQP.js";import"./BUIRoutingProvider-B9l2I63u.js";import"./openLink-BAk59qtu.js";import"./useResolvedHref-CvA6lHFs.js";const N={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
