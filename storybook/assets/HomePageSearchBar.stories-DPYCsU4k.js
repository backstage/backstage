import{j as r}from"./jsx-runtime-CvpxdxdE.js";import{r as l,H as d}from"./plugin-2Fuj2kKq.js";import{s as u}from"./api-mJEpP5Oi.js";import{S as s}from"./Grid-BY2EZ_z9.js";import{m as h}from"./makeStyles-yUUo8jj4.js";import{w as g}from"./appWrappers-Dwrkksgp.js";import{T as x}from"./TestApiProvider-CaP8DdS9.js";import"./index-DSHF18-l.js";import"./iframe-B9zrtCjt.js";import"./index-Ccex0xpY.js";import"./ApiRef-DDVPwL0h.js";import"./Plugin-mdvI-QAo.js";import"./componentData-CNQluCuE.js";import"./useAnalytics-BqSe3k6a.js";import"./ConfigApi-1QFqvuIK.js";import"./index-CEhUYg2U.js";import"./useRouteRef-clHAB9KK.js";import"./defaultTheme-DT8oR2d2.js";import"./capitalize-Bw5a1ocu.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./index-DBvFAGNd.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./MockTranslationApi-CqZA_upk.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BaoXGylq.js";import"./toArray-BGA7wbLE.js";import"./index-D9gx4uDp.js";import"./TranslationApi-NYdUF01F.js";import"./WebStorage-BMQO-dXK.js";import"./useAsync-W0CErRou.js";import"./useMountedState-BK0Y35lN.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./index-B0bGgVUV.js";import"./ThemeProvider-BZpfpFrZ.js";import"./CssBaseline-DWDV0Ah6.js";import"./palettes-Bwgvserk.js";const ur={title:"Plugins/Home/Components/SearchBar",decorators:[e=>g(r.jsx(r.Fragment,{children:r.jsx(x,{apis:[[u,{query:()=>Promise.resolve({results:[]})}]],children:r.jsx(e,{})})}),{mountedRoutes:{"/hello-search":l}})]},t=()=>r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(d,{placeholder:"Search"})})}),S=h(e=>({searchBar:{display:"flex",maxWidth:"60vw",backgroundColor:e.palette.background.paper,boxShadow:e.shadows[1],padding:"8px 0",borderRadius:"50px",margin:"auto"},searchBarOutline:{borderStyle:"none"}})),o=()=>{const e=S();return r.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:r.jsx(s,{container:!0,item:!0,xs:12,alignItems:"center",direction:"row",children:r.jsx(d,{classes:{root:e.searchBar},InputProps:{classes:{notchedOutline:e.searchBarOutline}},placeholder:"Search"})})})};t.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};var i,a,n;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
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
