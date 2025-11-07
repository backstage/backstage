import{j as t,T as a,c,C as g,m as l}from"./iframe-BpYUhtQT.js";import{b as i,r as d}from"./plugin-CvKOWj6E.js";import{S as s}from"./Grid-BSBIJVeD.js";import{w as u}from"./appWrappers-peGXwDQa.js";import{T as f}from"./TemplateBackstageLogo-BZdrP-PH.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DowXY3sc.js";import"./componentData-BaoDxexO.js";import"./useAnalytics-Bh2pk9PK.js";import"./useApp-DvIsmpbF.js";import"./useRouteRef-l3dtiGOV.js";import"./index-Ce36-Nje.js";import"./InfoCard-BU1H8Nsz.js";import"./CardContent-BIK6qFXi.js";import"./ErrorBoundary-DzqamQ5F.js";import"./ErrorPanel-DX0kqAsP.js";import"./WarningPanel-8zkHCnj8.js";import"./ExpandMore-CeSJ010X.js";import"./AccordionDetails-fjjprATf.js";import"./index-DnL3XN75.js";import"./Collapse-CmnpFYn4.js";import"./MarkdownContent-BWS4BjxZ.js";import"./CodeSnippet-C2KdpqrO.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./CopyTextButton-DC1eYg7O.js";import"./useCopyToClipboard-shAo73Yc.js";import"./useMountedState-DBGgrpWA.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";import"./Portal-OHyZAVgE.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./ListItem-DoWEcNrm.js";import"./ListItemText-CJKnCLsZ.js";import"./LinkButton-PBhijShz.js";import"./Button-BY1Og1vF.js";import"./Link-CMqafiV1.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-arrMMvmZ.js";import"./Divider-C5hfIyuI.js";import"./CardActions-CtZbu5K_.js";import"./BottomLink-DlULM6Ak.js";import"./ArrowForward-BIypQajv.js";import"./DialogTitle-CB5Y5dHf.js";import"./Modal-0XcuTVfd.js";import"./Backdrop-RvGqs8Vm.js";import"./useObservable-3jB7UW4m.js";import"./useIsomorphicLayoutEffect-1EIRTIdR.js";import"./useAsync-BpYeyvGz.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
