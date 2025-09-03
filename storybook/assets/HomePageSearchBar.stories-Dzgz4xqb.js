import{j as r}from"./jsx-runtime-hv06LKfz.js";import{H as i,r as a}from"./plugin-Dc-TBg3D.js";import{s as n}from"./api-YILTVPsk.js";import{S as s}from"./Grid-8Ap4jsYG.js";import{m}from"./makeStyles-CJp8qHqH.js";import{w as p}from"./appWrappers-9ZYivgV2.js";import{T as c}from"./TestApiProvider-DCQwDAHh.js";import"./index-D8-PC79C.js";import"./iframe-B0lKZbgt.js";import"./index-DP9-3wfB.js";import"./ApiRef-ByCJBjX1.js";import"./Plugin-IiR5jw9N.js";import"./componentData-DvKcogcx.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./useApp-BOX1l_wP.js";import"./useRouteRef-ZIOUJ-Yz.js";import"./index-B7KODvs-.js";import"./defaultTheme-NkpNA350.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./UnifiedThemeProvider-CQwkhmjj.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-CG-FC_6P.js";import"./toArray-D29G-OqT.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-_vmM7-EO.js";import"./ThemeProvider-CfpqDJNO.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";const pr={title:"Plugins/Home/Components/SearchBar",decorators:[e=>p(r.jsx(r.Fragment,{children:r.jsx(c,{apis:[[n,{query:()=>Promise.resolve({results:[]})}]],children:r.jsx(e,{})})}),{mountedRoutes:{"/hello-search":a}})]},t=()=>r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(i,{placeholder:"Search"})})}),d=m(e=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:e.palette.background.paper,boxShadow:e.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),o=()=>{const e=d();return r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(i,{classes:{root:e.searchBar},InputProps:{classes:{notchedOutline:e.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar placeholder="Search" />
      </Grid>
    </Grid>;
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const cr=["Default","CustomStyles"];export{o as CustomStyles,t as Default,cr as __namedExportsOrder,pr as default};
