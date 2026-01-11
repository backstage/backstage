import{j as t,T as a,c,C as g,m as l}from"./iframe-C0ztlCqi.js";import{b as i,r as d}from"./plugin-D6qSC-Pj.js";import{S as s}from"./Grid-BJIH9AcQ.js";import{w as u}from"./appWrappers-SwbnenOq.js";import{T as f}from"./TemplateBackstageLogo-DQ0M-3LP.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C7koouQA.js";import"./componentData-CW45w-aT.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./useRouteRef-B0OGFprJ.js";import"./index-BSDdaq1o.js";import"./InfoCard-B_00yS8h.js";import"./CardContent-BIqibGTm.js";import"./ErrorBoundary-B8VGBRFr.js";import"./ErrorPanel-BYV5vIqY.js";import"./WarningPanel-DIeTt0sm.js";import"./ExpandMore-DjatSCT2.js";import"./AccordionDetails-Qdo8hGCI.js";import"./index-B9sM2jn7.js";import"./Collapse-BOuwDmTN.js";import"./MarkdownContent-B6mn0xbm.js";import"./CodeSnippet-B5tPiRbT.js";import"./Box-CzQDPnzy.js";import"./styled-CWdZ-Z1U.js";import"./CopyTextButton-CR_eNMPC.js";import"./useCopyToClipboard-Cj1xpuKu.js";import"./useMountedState-CWuBAMfh.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";import"./Portal-DgY2uLlM.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./ListItem-BjSKqJNR.js";import"./ListItemText-C6kGUtI_.js";import"./LinkButton-Ce6yUEJH.js";import"./Button-CoF0Xodx.js";import"./Link-BUMam9f4.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-ComZ7hKq.js";import"./Divider-CQWOB-Qy.js";import"./CardActions-CviPlupu.js";import"./BottomLink-C1LO4qL8.js";import"./ArrowForward-CZyq4r4K.js";import"./DialogTitle-BqVBbkwh.js";import"./Modal-iwdO8Psb.js";import"./Backdrop-B-rl279U.js";import"./useObservable-bc9p5D-G.js";import"./useIsomorphicLayoutEffect-HC7ppjUM.js";import"./useAsync-BkXPEwdl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
