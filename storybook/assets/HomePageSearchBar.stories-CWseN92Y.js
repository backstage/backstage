import{j as e,T as n,m as i}from"./iframe-BKfEGE7G.js";import{H as a,r as c}from"./plugin-_OgSNOg9.js";import{s as m}from"./api-DhH7lEZ9.js";import{S as o}from"./Grid-vX9qBbX0.js";import{w as p}from"./appWrappers-BhL0UeRU.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Dwj1Q-YF.js";import"./Plugin-CmKCshsM.js";import"./componentData-MugjuQjt.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./useRouteRef-B__3vLRT.js";import"./index-DxVjIFhW.js";import"./useObservable-1flBwXTR.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const b={title:"Plugins/Home/Components/SearchBar",decorators:[r=>p(e.jsx(e.Fragment,{children:e.jsx(n,{apis:[[m,{query:()=>Promise.resolve({results:[]})}]],children:e.jsx(r,{})})}),{mountedRoutes:{"/hello-search":c}})]},t=()=>e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{placeholder:"Search"})})}),d=i(r=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:r.palette.background.paper,boxShadow:r.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),s=()=>{const r=d();return e.jsx(o,{container:!0,justifyContent:"center",spacing:6,children:e.jsx(o,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:e.jsx(a,{classes:{root:r.searchBar},InputProps:{classes:{notchedOutline:r.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const k=["Default","CustomStyles"];export{s as CustomStyles,t as Default,k as __namedExportsOrder,b as default};
