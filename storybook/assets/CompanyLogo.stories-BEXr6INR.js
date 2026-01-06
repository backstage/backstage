import{j as t,T as a,c,C as g,m as l}from"./iframe-DgkzaRcz.js";import{b as i,r as d}from"./plugin-KjjyD6lr.js";import{S as s}from"./Grid-13HvIHxd.js";import{w as u}from"./appWrappers-BBkmPso_.js";import{T as f}from"./TemplateBackstageLogo-BtVufr8s.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Dd63G45J.js";import"./componentData-D6jwBdZo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./useRouteRef-CgaN9BS2.js";import"./index-BovWTFKo.js";import"./InfoCard-DroCXsE2.js";import"./CardContent-BEcXzYfT.js";import"./ErrorBoundary-BMyytlZG.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./index-B9sM2jn7.js";import"./Collapse-zjOOSLQm.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./useMountedState-C4ChfPSk.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./Portal-DiyW3rHr.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./ListItemText-BTjp8q3D.js";import"./LinkButton-Cj7uwqzc.js";import"./Button-DputNV-f.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BIR3esA0.js";import"./Divider-BsgTAdRC.js";import"./CardActions-VTkMzbqT.js";import"./BottomLink-DudYzn0u.js";import"./ArrowForward-Df-EQyM5.js";import"./DialogTitle-CLNs8i90.js";import"./Modal-BMl9YgIm.js";import"./Backdrop-Do9s46dm.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./useAsync-B6sI7pgh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
