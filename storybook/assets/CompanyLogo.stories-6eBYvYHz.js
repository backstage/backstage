import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DLcIH_b-.js";import{b as i,r as d}from"./plugin-0ZeJDv4r.js";import{S as s}from"./Grid-CHWXErYD.js";import{w as u}from"./appWrappers-c50PuD_P.js";import{T as f}from"./TemplateBackstageLogo-CaaP6j2y.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BWXACEjV.js";import"./componentData-C1Rjz3DB.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./useRouteRef-D96ygvpF.js";import"./index-DTUFdyDi.js";import"./InfoCard-Dkx3ZgXO.js";import"./CardContent-InV1eJC6.js";import"./ErrorBoundary-DMqIfELc.js";import"./ErrorPanel-DxXUdzmq.js";import"./WarningPanel-B3vPuQN4.js";import"./ExpandMore-C68SGr3c.js";import"./AccordionDetails-tL39bQia.js";import"./index-B9sM2jn7.js";import"./Collapse-BJd8DAV0.js";import"./MarkdownContent-Cp_Yq8fi.js";import"./CodeSnippet-C1jqIUTN.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./CopyTextButton-BGx5v8bI.js";import"./useCopyToClipboard-D3pZMe8I.js";import"./useMountedState-CJM5rP6v.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";import"./Portal-D2sb6xU7.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./ListItem-BtxOUJ8W.js";import"./ListItemText-C61nqRKy.js";import"./LinkButton-C9WhmMmo.js";import"./Link-Dc4YfHTT.js";import"./lodash-rxUtCtQt.js";import"./Button-B2shhtfY.js";import"./CardHeader-C4FrCkZC.js";import"./Divider-fjKwa6Mv.js";import"./CardActions-BrXGgoXX.js";import"./BottomLink-CUAcGApu.js";import"./ArrowForward-PHFQlPVc.js";import"./DialogTitle--QOAyxVA.js";import"./Modal-DqSKD8Sk.js";import"./Backdrop-DbozdCou.js";import"./useObservable-DOAzawHV.js";import"./useIsomorphicLayoutEffect-5pUHGSZD.js";import"./useAsync-Dzs_Z8Sa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
