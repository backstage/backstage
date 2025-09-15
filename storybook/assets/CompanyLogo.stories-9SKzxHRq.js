import{j as t,T as a,c,C as g,m as l}from"./iframe-DLxOzT4t.js";import{b as i,r as d}from"./plugin-D1Vsl5C_.js";import{S as s}from"./Grid-DTcNMdF5.js";import{w as u}from"./appWrappers-BgZnm0lF.js";import{T as f}from"./TemplateBackstageLogo-D_MHL4Lp.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D7Oiw_QY.js";import"./componentData-B5NpAqVg.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./useRouteRef-HPNEm24O.js";import"./index-YuKWWjwW.js";import"./InfoCard-BX_nQnVA.js";import"./CardContent-Bj7b70Os.js";import"./ErrorBoundary-KnBb7wcL.js";import"./ErrorPanel-RMUJvBFr.js";import"./WarningPanel-Dc2tcH1q.js";import"./ExpandMore-K2fwTw0G.js";import"./AccordionDetails-DoLgEhQ2.js";import"./index-DnL3XN75.js";import"./Collapse-Dx6BQFCw.js";import"./MarkdownContent-C4aBi8UG.js";import"./CodeSnippet-Drl8Y1S9.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./CopyTextButton-B07LVSwl.js";import"./useCopyToClipboard-C72jLjo9.js";import"./useMountedState-DJ6mJaNE.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";import"./Portal-CdFb3as0.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./ListItem-C0vbBd3c.js";import"./ListItemText-DNlkMNGC.js";import"./LinkButton-BJUAlKHF.js";import"./Button-DWoU60bY.js";import"./Link-CRIj9jSl.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DKM6gr3f.js";import"./Divider-CWCd2akK.js";import"./CardActions-C6azI5IY.js";import"./BottomLink-BLtQezSR.js";import"./ArrowForward-BRfxW2ea.js";import"./DialogTitle-Dn15pT6I.js";import"./Modal-7EqbtETg.js";import"./Backdrop-D5lzsJdl.js";import"./useObservable-Bzw4Lu4i.js";import"./useAsync-CNKDNBbw.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const yo=["Default","CustomLogo"];export{e as CustomLogo,r as Default,yo as __namedExportsOrder,fo as default};
