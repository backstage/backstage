import{j as t,T as a,c,C as g,m as l}from"./iframe-Hw755TNi.js";import{b as i,r as d}from"./plugin-BL2Fs7YY.js";import{S as s}from"./Grid-w98sXAXk.js";import{w as u}from"./appWrappers-D03uvxZe.js";import{T as f}from"./TemplateBackstageLogo-C5FVhK4m.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BMqfvgOd.js";import"./componentData-BOwbR1Jz.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./useRouteRef-BmYWNidK.js";import"./index-CMiNgydu.js";import"./InfoCard-kqX3XXCw.js";import"./CardContent-CYUX33L8.js";import"./ErrorBoundary-C546sKxy.js";import"./ErrorPanel-CQgjrtaw.js";import"./WarningPanel-BGdCoFxI.js";import"./ExpandMore-CG9kYvvb.js";import"./AccordionDetails-6Uenh_Cj.js";import"./index-B9sM2jn7.js";import"./Collapse-Cpllhes9.js";import"./MarkdownContent-C43gFO83.js";import"./CodeSnippet-8GoXIwx4.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./CopyTextButton-8-jfuG_8.js";import"./useCopyToClipboard-DQJZpUYG.js";import"./useMountedState-DdJ7HSpX.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";import"./Portal-BZ6RZj06.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./ListItem-DwV3XkH8.js";import"./ListItemText-f-UryDTW.js";import"./LinkButton-CXrJu3G0.js";import"./Button-CpMmzG9U.js";import"./Link-BYu3CTsd.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-DYcL2J26.js";import"./Divider-BkC6drLy.js";import"./CardActions-_4wK1Jvd.js";import"./BottomLink-D76zrCEq.js";import"./ArrowForward-BgApEUXb.js";import"./DialogTitle-DJbOyMxK.js";import"./Modal-DYeoU8Cn.js";import"./Backdrop-0thaD7uc.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./useAsync-DhB8gEfG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
