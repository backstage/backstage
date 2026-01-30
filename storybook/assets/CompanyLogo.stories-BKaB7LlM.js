import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BdfNw3Ub.js";import{b as i,r as d}from"./plugin-CVG9qekJ.js";import{S as s}from"./Grid-ClCC6X0d.js";import{w as u}from"./appWrappers-DY8qCh6j.js";import{T as f}from"./TemplateBackstageLogo-CisNqlpM.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CIPiPeTO.js";import"./componentData-Bbvl56dJ.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./useRouteRef-alWxSySK.js";import"./index-DGTjwYkT.js";import"./InfoCard-Dkf7Vofo.js";import"./CardContent-Bx1WafIg.js";import"./ErrorBoundary-CvPyv2ZJ.js";import"./ErrorPanel-NKrLmxAy.js";import"./WarningPanel-Bslmfj1Q.js";import"./ExpandMore-dcQwlkUA.js";import"./AccordionDetails-CPLXq-Rf.js";import"./index-B9sM2jn7.js";import"./Collapse-DwRSSlvv.js";import"./MarkdownContent-B84ymYDA.js";import"./CodeSnippet-DtZ5NGdI.js";import"./Box-Ck7a0B2s.js";import"./styled-BblI00As.js";import"./CopyTextButton-DDSW1go4.js";import"./useCopyToClipboard-CQmr7kQ1.js";import"./useMountedState-B5cOerk8.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";import"./Portal-CuRfOwRS.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./ListItem-eROPvDGl.js";import"./ListItemText-Cap62zTH.js";import"./LinkButton-CSUtAD8o.js";import"./Link-CYv59bNI.js";import"./lodash-Czox7iJy.js";import"./Button-B1NvJhKb.js";import"./CardHeader-Blm8M5ME.js";import"./Divider--Mq8jTWg.js";import"./CardActions-AkNSsw6_.js";import"./BottomLink-BnpEOv8_.js";import"./ArrowForward-C7IoLyo6.js";import"./DialogTitle-DI-aEKjw.js";import"./Modal-DSvl6f6m.js";import"./Backdrop-NgNpouL3.js";import"./useObservable-CIl4-77m.js";import"./useIsomorphicLayoutEffect-C0bErC-3.js";import"./useAsync-DF3--aFh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
