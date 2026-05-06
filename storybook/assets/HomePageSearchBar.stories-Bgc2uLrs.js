import{j as e,a2 as n}from"./iframe-CwGYDpYH.js";import{H as a,r as i}from"./plugin-CdEJOMVL.js";import{S as o}from"./Grid-D9pxZO34.js";import{w as c}from"./appWrappers-ioq0ti9t.js";import{m}from"./makeStyles-B-7ejBjc.js";import{s as p}from"./api-MlTUZf_X.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BP4B84GF.js";import"./Plugin-BH133EJ2.js";import"./componentData-DSzXRFfR.js";import"./useAnalytics-Bir4eJYF.js";import"./useApp-hwqbTLFx.js";import"./useRouteRef-xXlqYEzJ.js";import"./WebStorage-CI04uxRe.js";import"./useAsync-BYRlsE8D.js";import"./useMountedState-DGAu4OuG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-RUz3cz4T.js";import"./useIsomorphicLayoutEffect-GLlfoH7M.js";import"./BUIProvider-BSpClcjO.js";import"./openLink-Ds4I99G_.js";import"./useResolvedHref-ByF3i79N.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
