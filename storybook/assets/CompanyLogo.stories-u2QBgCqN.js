import{j as t,T as a,c,C as g,m as l}from"./iframe-CA0Xqitl.js";import{b as i,r as d}from"./plugin-voUPehY7.js";import{S as s}from"./Grid-B8o7JoCY.js";import{w as u}from"./appWrappers-OMKuIXpb.js";import{T as f}from"./TemplateBackstageLogo-CxV6fZM_.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CwlDf1Ud.js";import"./componentData-CdEqgOPk.js";import"./useAnalytics-Bs3aHlE6.js";import"./useApp-DFdkDp9A.js";import"./useRouteRef-DoEb129Q.js";import"./index-ByTVIOef.js";import"./InfoCard-CWjsgdCI.js";import"./CardContent-CLH9eyHI.js";import"./ErrorBoundary-Brzk20pV.js";import"./ErrorPanel-xkUPraUn.js";import"./WarningPanel-DyFbjHtf.js";import"./ExpandMore-DfKPiaDM.js";import"./AccordionDetails-BewnNYiP.js";import"./index-B9sM2jn7.js";import"./Collapse-BpZh4zHv.js";import"./MarkdownContent-CWjBFtdf.js";import"./CodeSnippet-BbCr73he.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./CopyTextButton-Bm7dvK1x.js";import"./useCopyToClipboard-B8vbXgZE.js";import"./useMountedState-zGQsXHvo.js";import"./Tooltip-CuEp3aUv.js";import"./Popper-yvDUz_ZU.js";import"./Portal-DUJxNLzx.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./ListItem-BzxviKme.js";import"./ListItemText-BwZgc58h.js";import"./LinkButton-mfjqNKAK.js";import"./Button-CbaUxuKj.js";import"./Link-D1vtE7Ac.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CVthFMjM.js";import"./Divider-Dil931lt.js";import"./CardActions-Im4oiJ-Q.js";import"./BottomLink-BPv30Qn0.js";import"./ArrowForward-Di5ER0Ic.js";import"./DialogTitle-COZeQRP2.js";import"./Modal-CxVdZ6wB.js";import"./Backdrop-Cdn7d1XZ.js";import"./useObservable-DY424ZJv.js";import"./useIsomorphicLayoutEffect-rHGqqG8J.js";import"./useAsync-BGwS6Vz2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const {
    container
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    container,
    svg,
    path
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
      svg,
      path
    }} />} />
    </Grid>;
}`,...e.parameters?.docs?.source}}};const Co=["Default","CustomLogo"];export{e as CustomLogo,r as Default,Co as __namedExportsOrder,yo as default};
