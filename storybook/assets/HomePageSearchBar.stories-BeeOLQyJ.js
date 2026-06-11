import{bR as e,a5 as n}from"./iframe-BNSLO1vV.js";import{H as a,r as i}from"./plugin-Ba8BrMGu.js";import{S as o}from"./Grid-C9Nu3WVI.js";import{O as c}from"./appWrappers-D25q5zIL.js";import{m}from"./makeStyles-CZnQSWDh.js";import{s as p}from"./api-BZ8kNTH5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DIm3q6K3.js";import"./Plugin-CBXt3IyR.js";import"./componentData-Cg5QnkiE.js";import"./useAnalytics-CeiKLkx8.js";import"./useApp-CMrJz5U2.js";import"./useRouteRef-wgc6G7xr.js";import"./WebStorage-CnW4n8fw.js";import"./useAsync-CHPEVN6N.js";import"./useMountedState-C8SUUxYo.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Xx9BLHT2.js";import"./useIsomorphicLayoutEffect-DTD9neL-.js";import"./BUIProvider-C1aeAfVF.js";import"./openLink-D76OisA9.js";import"./useResolvedHref-Cc2IO8w5.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
