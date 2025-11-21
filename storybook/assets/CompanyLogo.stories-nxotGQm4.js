import{j as t,T as a,c,C as g,m as l}from"./iframe-C8ExrwzU.js";import{b as i,r as d}from"./plugin-Cege8qGM.js";import{S as s}from"./Grid-DspeJWIy.js";import{w as u}from"./appWrappers-BaMznTf3.js";import{T as f}from"./TemplateBackstageLogo-CKHnC1aT.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-B2v-vDzx.js";import"./componentData-Dj-cJqs3.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./useRouteRef-C6pJYPst.js";import"./index-BgOC1FTX.js";import"./InfoCard-D_4zmvid.js";import"./CardContent-BgCJnSoO.js";import"./ErrorBoundary-F_hBtf1o.js";import"./ErrorPanel-CDFCJhtV.js";import"./WarningPanel-CfgTJdNP.js";import"./ExpandMore-CE-AlmPZ.js";import"./AccordionDetails-CKE4MG-J.js";import"./index-DnL3XN75.js";import"./Collapse-DuUvJIAd.js";import"./MarkdownContent-CQVlpVaR.js";import"./CodeSnippet-BRYqmlwq.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./CopyTextButton-CfcOHHdO.js";import"./useCopyToClipboard-CrQaQuzV.js";import"./useMountedState-UCRwgIDM.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";import"./Portal-BvPm8y4I.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./ListItem-DGmfxxZu.js";import"./ListItemText-CIKs-KSS.js";import"./LinkButton-DxVeoCL2.js";import"./Button-BirFLWZh.js";import"./Link-D0uGQ-EQ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BB7CXK1i.js";import"./Divider-4xHmk1Qy.js";import"./CardActions-BOmf1H7g.js";import"./BottomLink-DMese3Ls.js";import"./ArrowForward-Dcuc9hR9.js";import"./DialogTitle-B89siiWU.js";import"./Modal-DbOcvVvU.js";import"./Backdrop-86Drsiia.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./useAsync-DwtigoPq.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
