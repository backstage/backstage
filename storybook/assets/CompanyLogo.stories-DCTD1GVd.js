import{j as t,T as a,c,C as g,m as l}from"./iframe-CDMGjht1.js";import{b as i,r as d}from"./plugin-CiOtfWWm.js";import{S as s}from"./Grid-BgC6P4wx.js";import{w as u}from"./appWrappers-CeVFb9Sb.js";import{T as f}from"./TemplateBackstageLogo-CKQOX-IK.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CfrHLNSO.js";import"./componentData-BhfXY_7K.js";import"./useAnalytics-DNi1LI_h.js";import"./useApp-DP3Hy8Yt.js";import"./useRouteRef-BKp3R5P0.js";import"./index-K4DNRamS.js";import"./InfoCard-BUwu9wAu.js";import"./CardContent-C3OBeIV7.js";import"./ErrorBoundary-DXFxbn_q.js";import"./ErrorPanel-CHa0fGo8.js";import"./WarningPanel-DI2PepE0.js";import"./ExpandMore-BW8Ytfi4.js";import"./AccordionDetails-xoWWWHy1.js";import"./index-B9sM2jn7.js";import"./Collapse-T-NVxaZE.js";import"./MarkdownContent-Cqhsm4_s.js";import"./CodeSnippet-CLIpVCVn.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./CopyTextButton-BUSczag8.js";import"./useCopyToClipboard-Dpkpx4yl.js";import"./useMountedState-BCg_GyJl.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";import"./Portal-Dv12doci.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./ListItem-CGpakNnt.js";import"./ListItemText-DadlRFVX.js";import"./LinkButton-Bm0UAYAk.js";import"./Button-CJM2mVMw.js";import"./Link-D_ooISTq.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CXqhzRgw.js";import"./Divider-BQTEKmhn.js";import"./CardActions-5HkeXWm_.js";import"./BottomLink-B7jTzdbr.js";import"./ArrowForward-BtyH-PNr.js";import"./DialogTitle-BcD20zOV.js";import"./Modal-DiZS-g1t.js";import"./Backdrop-CYAcd77J.js";import"./useObservable-BMqS9uye.js";import"./useIsomorphicLayoutEffect-BOxOOV-6.js";import"./useAsync-F2seOW-M.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
