import{j as t,T as a,c,C as g,m as l}from"./iframe-OUC1hy1H.js";import{b as i,r as d}from"./plugin-Ba_XObH0.js";import{S as s}from"./Grid-DL-Pv4jh.js";import{w as u}from"./appWrappers-DdOwToTM.js";import{T as f}from"./TemplateBackstageLogo-AxRh1HHp.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DZn2Fxqk.js";import"./componentData-vJLnAM-9.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./useRouteRef-CAXRaq-D.js";import"./index-_R9_qqkB.js";import"./InfoCard-CwMIYekH.js";import"./CardContent-Cy9Tlq5V.js";import"./ErrorBoundary-ajCvZdhL.js";import"./ErrorPanel-D45LPvzG.js";import"./WarningPanel-4XJbGV6W.js";import"./ExpandMore-YNQPypsM.js";import"./AccordionDetails-BV-iIFxu.js";import"./index-B9sM2jn7.js";import"./Collapse-WWepLYBs.js";import"./MarkdownContent-DHn9pYVo.js";import"./CodeSnippet-DchPM48d.js";import"./Box-BmoTrTFH.js";import"./styled-A6cHt6de.js";import"./CopyTextButton-DRNDJ6Lk.js";import"./useCopyToClipboard-B_WaDLJZ.js";import"./useMountedState-BrWxqueh.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";import"./Portal-DWQSZWuh.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./ListItem-CyBq-NVx.js";import"./ListItemText-BN19jovg.js";import"./LinkButton-KIWM0vJK.js";import"./Button-NJYqsc8m.js";import"./Link-CyOWt6Zg.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-GsaXemtv.js";import"./Divider-CEY86Jg2.js";import"./CardActions-ZHQriakr.js";import"./BottomLink-uShqIaMy.js";import"./ArrowForward-CNrami9f.js";import"./DialogTitle-CzK5jlaa.js";import"./Modal-B-jUxT4P.js";import"./Backdrop-D5NJdiNK.js";import"./useObservable-BKXVW6Yy.js";import"./useIsomorphicLayoutEffect-BzuPE6E0.js";import"./useAsync-4gF4WzZl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
