import{j as r}from"./jsx-runtime-Cw0GR0a5.js";import{r as l,H as d}from"./plugin-Bd98UmjO.js";import{s as u}from"./api-B335RvSG.js";import{S as s}from"./Grid-Cd4CaOSn.js";import{m as h}from"./makeStyles-3WuthtJ7.js";import{w as g}from"./appWrappers-MqXYj6i0.js";import{T as x}from"./TestApiProvider-4wn3im9M.js";import"./index-CTjT7uj6.js";import"./iframe-LSPN3x1e.js";import"./index-jDfqsyy3.js";import"./ApiRef-CqkoWjZn.js";import"./Plugin-CuJVBN9V.js";import"./componentData-B20g3K9Y.js";import"./useAnalytics-DVyBXs_0.js";import"./ConfigApi-D1qiBdfc.js";import"./index-w6SBqnNd.js";import"./useRouteRef-DYu9ECtT.js";import"./defaultTheme-U8IXQtr7.js";import"./capitalize-CjHL08xv.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./MockTranslationApi-BG4T7xVR.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-Cm41Z5uw.js";import"./toArray-QeYAVC82.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./WebStorage-0NkRnF9s.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./index-BRV0Se7Z.js";import"./ThemeProvider-HGIy1WSf.js";import"./CssBaseline-B78aEvSr.js";import"./palettes-Bwgvserk.js";const ur={title:"Plugins/Home/Components/SearchBar",decorators:[e=>g(r.jsx(r.Fragment,{children:r.jsx(x,{apis:[[u,{query:()=>Promise.resolve({results:[]})}]],children:r.jsx(e,{})})}),{mountedRoutes:{"/hello-search":l}})]},t=()=>r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(d,{placeholder:"Search"})})}),S=h(e=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:e.palette.background.paper,boxShadow:e.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),o=()=>{const e=S();return r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(d,{classes:{root:e.searchBar},InputProps:{classes:{notchedOutline:e.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};var i,a,n;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
  return <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar placeholder="Search" />
      </Grid>
    </Grid>;
}`,...(n=(a=t.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var m,p,c;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
}`,...(c=(p=o.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const hr=["Default","CustomStyles"];export{o as CustomStyles,t as Default,hr as __namedExportsOrder,ur as default};
