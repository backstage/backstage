import{j as t,T as a,c,C as g,m as l}from"./iframe-DqJQ9uPs.js";import{b as i,r as d}from"./plugin-BWMFMYkc.js";import{S as s}from"./Grid-KKLALRV6.js";import{w as u}from"./appWrappers-DvUcS6kA.js";import{T as f}from"./TemplateBackstageLogo-EnCns9nV.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DUvFkCSb.js";import"./componentData-9JsUC9W5.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./useRouteRef-DZAPdgx2.js";import"./index-DalzLXVm.js";import"./InfoCard-DfVmKB2_.js";import"./CardContent-C-XbivhQ.js";import"./ErrorBoundary-CCN1fcMR.js";import"./ErrorPanel-BTFsykmd.js";import"./WarningPanel-DWxbAFrU.js";import"./ExpandMore-BotAWQ1n.js";import"./AccordionDetails-Dyf75Eaf.js";import"./index-DnL3XN75.js";import"./Collapse-BECsH0M_.js";import"./MarkdownContent-DTBwyM42.js";import"./CodeSnippet-BQDzaUOg.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./CopyTextButton-Y9iCOjyT.js";import"./useCopyToClipboard-DMYhOdjt.js";import"./useMountedState-BU_XpB7e.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";import"./Portal-CAVLkONX.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./ListItem-DIBtNilh.js";import"./ListItemText-QaJAw11k.js";import"./LinkButton-CscTtu-Y.js";import"./Button-D9LFAX2g.js";import"./Link-ClrQx1QP.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-C2FhjhCg.js";import"./Divider-xOTMBAcj.js";import"./CardActions-DVY4viYA.js";import"./BottomLink-v4r4qDIO.js";import"./ArrowForward-DPFWrTp5.js";import"./DialogTitle-DiqXRAVM.js";import"./Modal-DbdYSBMO.js";import"./Backdrop-lmkQ576F.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./useAsync-DlfksqDa.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
