import{bR as e,a5 as n}from"./iframe-BoHeIN98.js";import{H as a,r as i}from"./plugin-82UBDCLd.js";import{S as o}from"./Grid-Vi-QfLwX.js";import{O as c}from"./appWrappers-DJHoW3YO.js";import{m}from"./makeStyles-ChrV0xkl.js";import{s as p}from"./api-BLZXQj8Y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CT_UShKe.js";import"./Plugin-CkIfdWAy.js";import"./componentData-f-24HF9Q.js";import"./useAnalytics-Dx-eH7bg.js";import"./useApp-CgoYxTWd.js";import"./useRouteRef-lGm3-Wkr.js";import"./WebStorage-Hoe5HKIB.js";import"./useAsync-DSh_cgtj.js";import"./useMountedState-B0_hTaNv.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-yB9X5TTO.js";import"./useIsomorphicLayoutEffect-Cty6nLQY.js";import"./BUIProvider-DDPA0RvA.js";import"./openLink-CzGsEk9E.js";import"./useResolvedHref-D2CCdNlh.js";const E={title:"Plugins/Home/Components/SearchBar",decorators:[r=>c(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[p,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":i}})],tags:["!manifest"]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=m(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
