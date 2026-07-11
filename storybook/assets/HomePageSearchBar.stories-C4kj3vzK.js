import{bR as e,a5 as n}from"./iframe-COykYx45.js";import{H as a,r as i}from"./plugin-DYSr0H5J.js";import{S as o}from"./Grid-BRcD6lxX.js";import{O as c}from"./appWrappers-_7AfosWs.js";import{m}from"./makeStyles-4LVf8ZW1.js";import{s as p}from"./api-D8D9l_gL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dv0fHl7n.js";import"./Plugin-Dfqv077V.js";import"./componentData-DnWTcKbZ.js";import"./useAnalytics-D6lRulOX.js";import"./useApp-OLJN8mL2.js";import"./useRouteRef-CO8HfKAe.js";import"./WebStorage-DtSjkpRW.js";import"./useAsync-cYsllXRD.js";import"./useMountedState-Bnm4--Gr.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-AfbIGo3s.js";import"./useIsomorphicLayoutEffect-B5EgTCFx.js";import"./BUIProvider-C1SLyjta.js";import"./openLink-DVwmAOKC.js";import"./useResolvedHref-B4mcLcl5.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
