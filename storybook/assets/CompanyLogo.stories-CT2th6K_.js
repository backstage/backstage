import{j as t,T as a,c,C as g,m as l}from"./iframe-CG856I7g.js";import{b as i,r as d}from"./plugin-BqJnaI0I.js";import{S as s}from"./Grid-CG84KQIV.js";import{w as u}from"./appWrappers-DEP7SCZP.js";import{T as f}from"./TemplateBackstageLogo-BtzjqNYq.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D3BXoFcT.js";import"./componentData-aFf6ewzF.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";import"./useRouteRef-B8PYaAAi.js";import"./index-PWNHdhKk.js";import"./InfoCard-DY4hdaxa.js";import"./CardContent-BwT5h854.js";import"./ErrorBoundary-BK2MlTdY.js";import"./ErrorPanel-DZ1ApYdQ.js";import"./WarningPanel-CDDj3MLB.js";import"./ExpandMore-DTKTum2k.js";import"./AccordionDetails-CmfQvp7G.js";import"./index-B9sM2jn7.js";import"./Collapse-vpACe9Y2.js";import"./MarkdownContent-BwSLPwTP.js";import"./CodeSnippet-CUezJ-Mg.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./CopyTextButton-B_1HfWK0.js";import"./useCopyToClipboard-CUxcez1F.js";import"./useMountedState-Bvsb1ptg.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";import"./Portal-Bhu3uB1L.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./ListItem-BWUkcOJl.js";import"./ListItemText-QtFV-4wl.js";import"./LinkButton-B6IB7a9D.js";import"./Button-os8mT4aD.js";import"./Link-Cd9n886D.js";import"./lodash-Czox7iJy.js";import"./CardHeader-BjVEl-5E.js";import"./Divider-gH4LD_Ra.js";import"./CardActions-CxPYtsdJ.js";import"./BottomLink-DB2Nr5nG.js";import"./ArrowForward-ClGRA-Ks.js";import"./DialogTitle-BYAFwPKR.js";import"./Modal-odp3IgY3.js";import"./Backdrop-DWQDC5UU.js";import"./useObservable-CZ-R5m23.js";import"./useIsomorphicLayoutEffect-BmiTUf2k.js";import"./useAsync-CdIFnDD6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
