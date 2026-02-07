import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CNJ8DcrC.js";import{b as i,r as d}from"./plugin-BPkq4E_8.js";import{S as s}from"./Grid-DnFVy6t2.js";import{w as u}from"./appWrappers-E57FXAeC.js";import{T as f}from"./TemplateBackstageLogo-DyMGOrs3.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-_567Mtia.js";import"./componentData-D59WTCiB.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./useRouteRef-DK6B5L3X.js";import"./index-DkthXm2e.js";import"./InfoCard-c8gqZTx-.js";import"./CardContent-C_MhXWNV.js";import"./ErrorBoundary-BHcUmZ0p.js";import"./ErrorPanel-Cfax6ZbZ.js";import"./WarningPanel-CAoaG3c4.js";import"./ExpandMore-P7Ms8H_E.js";import"./AccordionDetails-DFFwOrZV.js";import"./index-B9sM2jn7.js";import"./Collapse-CrkD-6-R.js";import"./MarkdownContent-BzDAUZZf.js";import"./CodeSnippet-Cp3x4Ngz.js";import"./Box-CtI-kND1.js";import"./styled-CIO5_I8O.js";import"./CopyTextButton-C1aJOmrW.js";import"./useCopyToClipboard-CMtB8QI9.js";import"./useMountedState-C-7cl-bH.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";import"./Portal-C64Jz60P.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./ListItem-31tIz_LL.js";import"./ListItemText-BjTS0dlF.js";import"./LinkButton-CdwWq3H_.js";import"./Link-UFLrOQPe.js";import"./lodash-Czox7iJy.js";import"./Button-BezvKFLQ.js";import"./CardHeader-Croduw33.js";import"./Divider-BSUI1Y9r.js";import"./CardActions-D8qTLEGs.js";import"./BottomLink-iz8-XHvK.js";import"./ArrowForward-Xg3lDUK4.js";import"./DialogTitle-BtCIznAI.js";import"./Modal-RnbSc_sU.js";import"./Backdrop-BXGq-7tC.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./useAsync-02suuxa3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
