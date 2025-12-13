import{j as t,T as a,c,C as g,m as l}from"./iframe-DDGN0cGv.js";import{b as i,r as d}from"./plugin-DVGBlnIw.js";import{S as s}from"./Grid-D5cwdvdp.js";import{w as u}from"./appWrappers-C8vp-7ey.js";import{T as f}from"./TemplateBackstageLogo-BAMfgDbP.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CBvsz8vm.js";import"./componentData-lXmOowuG.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./useRouteRef-6TTRl5Mq.js";import"./index-DCDfH_Li.js";import"./InfoCard-_Sz2aZkG.js";import"./CardContent-D6aqZ2EH.js";import"./ErrorBoundary-LiF7Clop.js";import"./ErrorPanel-sm5fOIxM.js";import"./WarningPanel-BvxUrI8I.js";import"./ExpandMore-DdbG_Iny.js";import"./AccordionDetails-D8hpySZx.js";import"./index-B9sM2jn7.js";import"./Collapse-1BtLbcFp.js";import"./MarkdownContent-D_mSSllG.js";import"./CodeSnippet-DUu5zKgy.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./CopyTextButton-K6z11-1u.js";import"./useCopyToClipboard-BVpL61aI.js";import"./useMountedState-DWcF_6cb.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";import"./Portal-BqHzn-UB.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./ListItem-B4p-bJZY.js";import"./ListItemText-D6aBcig9.js";import"./LinkButton-Dund-JVG.js";import"./Button-BfPTYQOm.js";import"./Link-UwAe9NOh.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-tCD53RXU.js";import"./Divider-nJoj97pl.js";import"./CardActions-CHc_Iyiq.js";import"./BottomLink-DHFnJkTT.js";import"./ArrowForward-KHx9CCNT.js";import"./DialogTitle-CZfoj8Tu.js";import"./Modal-y_bxeVJ1.js";import"./Backdrop-0jy0HFas.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./useAsync-2V8xCCu6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
