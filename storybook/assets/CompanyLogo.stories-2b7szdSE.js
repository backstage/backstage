import{j as t,T as a,c,C as g,m as l}from"./iframe-CIdfBUNc.js";import{b as i,r as d}from"./plugin-Ce5LEohf.js";import{S as s}from"./Grid-CNMGd53o.js";import{w as u}from"./appWrappers-AgrnuiEj.js";import{T as f}from"./TemplateBackstageLogo-DkVbWhZu.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Cal27Rxh.js";import"./componentData-CJ11DeEU.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./useRouteRef-BtzOE2h6.js";import"./index-6Q4r393t.js";import"./InfoCard-JJieDDHR.js";import"./CardContent-DkWk2PaR.js";import"./ErrorBoundary-5twXAJLu.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./ExpandMore-CVq5yZzR.js";import"./AccordionDetails-Db8RrwKQ.js";import"./index-B9sM2jn7.js";import"./Collapse-C667vUQ9.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./CopyTextButton-B2Os4u3r.js";import"./useCopyToClipboard-C5xquscJ.js";import"./useMountedState-CxwBQu50.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";import"./Portal-CzMBs-js.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./ListItem-Dfr179My.js";import"./ListItemText-CPW3cjiy.js";import"./LinkButton-DENdbCNl.js";import"./Button-Ckh3f-JS.js";import"./Link-BiOJGlt4.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CYD6avdX.js";import"./Divider-DSMvF0Rh.js";import"./CardActions-DAFfhJ8c.js";import"./BottomLink-Wb3zLKXo.js";import"./ArrowForward-DWvoUq3l.js";import"./DialogTitle-D9_Z1_7w.js";import"./Modal-BoVNQ_gf.js";import"./Backdrop-CX0eMuCq.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./useAsync-Cop8mLj-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
