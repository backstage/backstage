import{j as t,U as a,V as c,W as g,m as l}from"./iframe-Bfb6es7h.js";import{b as i,r as d}from"./plugin-BrovwtcV.js";import{S as s}from"./Grid-fOEQuWsY.js";import{w as u}from"./appWrappers-DdoKMAzO.js";import{T as f}from"./TemplateBackstageLogo-w-ZscEcY.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CXIsHHNu.js";import"./componentData-ALPptmD3.js";import"./useAnalytics-CVOFFuvg.js";import"./useApp-kTvTF_u-.js";import"./useRouteRef-BqEacaGv.js";import"./index-BH1Qp3-H.js";import"./InfoCard-D7aUfm_W.js";import"./CardContent-D42-qhAJ.js";import"./ErrorBoundary-RfTVQpC0.js";import"./ErrorPanel-Cdw_oYMz.js";import"./WarningPanel-D8tYRIvI.js";import"./ExpandMore-DoDRnIYA.js";import"./AccordionDetails-CKP4iHhe.js";import"./index-B9sM2jn7.js";import"./Collapse-DB4Tv0RR.js";import"./MarkdownContent-BP6bDfRC.js";import"./CodeSnippet-BB1hf6Ht.js";import"./Box-C8tWNgkw.js";import"./styled-DNaQ7xBF.js";import"./CopyTextButton-Bg_o-RoR.js";import"./useCopyToClipboard-CxgcRXBX.js";import"./useMountedState-BiNiTtFn.js";import"./Tooltip-BIMvLisP.js";import"./Popper-C-IKLGjO.js";import"./Portal-DoGSafYV.js";import"./List-DdY4r3Qa.js";import"./ListContext-DK41gHFX.js";import"./ListItem-CdGfarMd.js";import"./ListItemText-VDXTeYlf.js";import"./LinkButton-BgEyZHgU.js";import"./Link-BXHXb0Ac.js";import"./lodash-Czox7iJy.js";import"./Button-DgLe45Cx.js";import"./CardHeader-hEQM7px_.js";import"./Divider-Dfh3vDVi.js";import"./CardActions-DwnWnO57.js";import"./BottomLink-P4zcIuMj.js";import"./ArrowForward-CTIzHOFz.js";import"./DialogTitle--znV04_h.js";import"./Modal-CMLC8fQ-.js";import"./Backdrop-BFCoYjYZ.js";import"./useObservable-D9R9w3U2.js";import"./useIsomorphicLayoutEffect-3QlRcHa3.js";import"./useAsync-DkTP0ua2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
