import{j as t,T as a,c,C as g,m as l}from"./iframe-BY6cr4Gs.js";import{b as i,r as d}from"./plugin-D9w6b_6Z.js";import{S as s}from"./Grid-CPNST6ei.js";import{w as u}from"./appWrappers-Pq-5KpLz.js";import{T as f}from"./TemplateBackstageLogo-BNKuFD4V.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-1eY0U0Da.js";import"./componentData-DkH1zoGD.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./useRouteRef-CBJLvC2e.js";import"./index-CidjncPb.js";import"./InfoCard-BuJiqpT7.js";import"./CardContent-JC9uGNq1.js";import"./ErrorBoundary-hvzZq_Hc.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./ExpandMore-3nEtbL-z.js";import"./AccordionDetails-B6u38Rkn.js";import"./index-B9sM2jn7.js";import"./Collapse-hpYL9C9B.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./CopyTextButton-CGe-CNwz.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./useMountedState-wBq7rhLl.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./Portal-RovY2swJ.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./ListItemText-DmFJDJ0x.js";import"./LinkButton-ByF38BEu.js";import"./Button-BcV-aad6.js";import"./Link-Y-vtcYZ5.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-C1KSGg0j.js";import"./Divider-0kZVZRxa.js";import"./CardActions-wlHMcfv2.js";import"./BottomLink-4rbJl6ej.js";import"./ArrowForward-C-vHhjk_.js";import"./DialogTitle-CbbvyQ_k.js";import"./Modal-27M29ymL.js";import"./Backdrop-BfxA9Fnq.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./useAsync-BOpzAa1K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
