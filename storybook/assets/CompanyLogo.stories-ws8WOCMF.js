import{j as t,T as a,c,C as g,m as l}from"./iframe-DVllq_JJ.js";import{b as i,r as d}from"./plugin-D3vE2yAH.js";import{S as s}from"./Grid-GLf92srY.js";import{w as u}from"./appWrappers-C9euYDcG.js";import{T as f}from"./TemplateBackstageLogo-DJWr0CHR.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DZCzK3PC.js";import"./componentData-ir7sX7tS.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./useRouteRef-Dq-yTMyo.js";import"./index-CuC9x3hw.js";import"./InfoCard-CHyQV-0n.js";import"./CardContent-BJRiL5GO.js";import"./ErrorBoundary-BL32Oe-y.js";import"./ErrorPanel-Yv09NjH-.js";import"./WarningPanel-CTVbrDnl.js";import"./ExpandMore-DeLbxlk1.js";import"./AccordionDetails-Df6QxQno.js";import"./index-DnL3XN75.js";import"./Collapse-BPkQPj1V.js";import"./MarkdownContent-C4WJ4LoY.js";import"./CodeSnippet-pYWcNvfR.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./CopyTextButton-DyV_pNjJ.js";import"./useCopyToClipboard-DQH_xRRB.js";import"./useMountedState-CAQUPkod.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";import"./Portal-BdFeljN4.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./ListItem-DLfoHZ9h.js";import"./ListItemText-C9klhbSR.js";import"./LinkButton-CyMvoAXZ.js";import"./Button-CqkFteVA.js";import"./Link-Dfj65VZ1.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-9ttq-nyk.js";import"./Divider-CjoboeOw.js";import"./CardActions-CigbsVLY.js";import"./BottomLink-C3Knj5tN.js";import"./ArrowForward-_2sqR9gC.js";import"./DialogTitle-tzRl7hzM.js";import"./Modal-Iqgu4vP7.js";import"./Backdrop-bmyTmjrQ.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./useAsync-2B4YlYUd.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
