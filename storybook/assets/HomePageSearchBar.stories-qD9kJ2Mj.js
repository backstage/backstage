import{bR as e,a5 as n}from"./iframe-CNmrqhdp.js";import{H as a,r as i}from"./plugin-DlP-rylR.js";import{S as o}from"./Grid-BGPHOMQP.js";import{O as c}from"./appWrappers-TRDMH51E.js";import{m}from"./makeStyles-CoULisOM.js";import{s as p}from"./api-CoPVOKZF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DkIbyARY.js";import"./Plugin-BA0J1vJQ.js";import"./componentData-Bajmr2_W.js";import"./useAnalytics-BfmOd9pS.js";import"./useApp-DjNgU9QR.js";import"./useRouteRef-8V-QgAtT.js";import"./WebStorage-C7CWBF3C.js";import"./useAsync-AVyJcLhD.js";import"./useMountedState-CokGl4ZB.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-6BaQCvWb.js";import"./useIsomorphicLayoutEffect-BrvmqhnJ.js";import"./BUIProvider-DQTw1zNm.js";import"./openLink-Dcd4pMbN.js";import"./useResolvedHref-wx132o6L.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const N=["Default","CustomStyles"];export{s as CustomStyles,t as Default,N as __namedExportsOrder,E as default};
