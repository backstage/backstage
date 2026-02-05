import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DVtcQ4_z.js";import{b as i,r as d}from"./plugin-Dz8jVe6c.js";import{S as s}from"./Grid-CRH4wMFl.js";import{w as u}from"./appWrappers-9shJdU2k.js";import{T as f}from"./TemplateBackstageLogo-BDiWaVje.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BFejrjRb.js";import"./componentData-DLUR4SEc.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./useRouteRef-CmZgmteL.js";import"./index-nBdCQRka.js";import"./InfoCard-lskUPJjc.js";import"./CardContent-CiVhExeM.js";import"./ErrorBoundary-DlSuROHw.js";import"./ErrorPanel-BTyMCoIE.js";import"./WarningPanel-DWnW9ndp.js";import"./ExpandMore-BZTl6lHp.js";import"./AccordionDetails-20s0m78U.js";import"./index-B9sM2jn7.js";import"./Collapse-BTPpLLfL.js";import"./MarkdownContent-C-D6oakD.js";import"./CodeSnippet-CJietKeS.js";import"./Box-D_1MPpAq.js";import"./styled-2Y3L2rTs.js";import"./CopyTextButton-DhwWsCh2.js";import"./useCopyToClipboard-ImQlBzLn.js";import"./useMountedState-rAyQYyeH.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";import"./Portal-kTp41skA.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./ListItem-C0fXON46.js";import"./ListItemText-CpGTJDVb.js";import"./LinkButton-6srsW-_l.js";import"./Link-t6CnRMqh.js";import"./lodash-Czox7iJy.js";import"./Button-B6Zk0t0c.js";import"./CardHeader-DLPiWAMi.js";import"./Divider-BmAsVb_O.js";import"./CardActions-DNd32Pjk.js";import"./BottomLink-zMVcDBLB.js";import"./ArrowForward-C8LFtIoy.js";import"./DialogTitle-DWxUih24.js";import"./Modal-C3aeePrL.js";import"./Backdrop-BrMkINGu.js";import"./useObservable-B_06OWLq.js";import"./useIsomorphicLayoutEffect-DivdhHMv.js";import"./useAsync-0ylosLEO.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
