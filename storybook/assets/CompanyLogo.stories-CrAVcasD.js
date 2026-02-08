import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BVVWNhNF.js";import{b as i,r as d}from"./plugin-DSi8Ut2S.js";import{S as s}from"./Grid-BhWDjvJh.js";import{w as u}from"./appWrappers-ChYKtzjD.js";import{T as f}from"./TemplateBackstageLogo-BHGPjAIx.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CgTcVBUB.js";import"./componentData-CcSGmjOp.js";import"./useAnalytics-DOlQNDHl.js";import"./useApp-CDZ4N_T1.js";import"./useRouteRef-BBaiKSnw.js";import"./index-Cytn1js_.js";import"./InfoCard-pIukSdGf.js";import"./CardContent-DDwUqD8r.js";import"./ErrorBoundary-DC0OPPNH.js";import"./ErrorPanel-CIBQJLIP.js";import"./WarningPanel-BKd-aVLN.js";import"./ExpandMore-DowbklPi.js";import"./AccordionDetails-RAdNuemB.js";import"./index-B9sM2jn7.js";import"./Collapse-BYFMHxpC.js";import"./MarkdownContent-DIwENC3V.js";import"./CodeSnippet-DsEjqB14.js";import"./Box-I6qpNjup.js";import"./styled-BXlk9tEQ.js";import"./CopyTextButton-D4a_r689.js";import"./useCopyToClipboard-BPci2e7u.js";import"./useMountedState-Lmv_QRT4.js";import"./Tooltip-B6-nubZA.js";import"./Popper-CpEGPy4_.js";import"./Portal-DukR7Qds.js";import"./List-CeUn_h_G.js";import"./ListContext-D6HHPv4d.js";import"./ListItem-896bCnNz.js";import"./ListItemText-rQpXHQMd.js";import"./LinkButton-BtHpMbGF.js";import"./Link-C8sZRddr.js";import"./lodash-Czox7iJy.js";import"./Button-BmiFnTzM.js";import"./CardHeader-D1smsiqM.js";import"./Divider-BEnyyVTc.js";import"./CardActions-COAPAgyc.js";import"./BottomLink-BS8gfZ3p.js";import"./ArrowForward-B0TORj3F.js";import"./DialogTitle-Y7DgGyxp.js";import"./Modal-BSykfrg4.js";import"./Backdrop-Dz78wVML.js";import"./useObservable-UOYoI0kL.js";import"./useIsomorphicLayoutEffect-C2UzxJwg.js";import"./useAsync-C3TxRl9Y.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
