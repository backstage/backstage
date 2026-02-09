import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CafSZihE.js";import{b as i,r as d}from"./plugin-B90-0LX7.js";import{S as s}from"./Grid-CE8ncWjM.js";import{w as u}from"./appWrappers-Bm81Y_Ag.js";import{T as f}from"./TemplateBackstageLogo-DKL2vb7J.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CmWRPz1q.js";import"./componentData-BMaKz9VF.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./useRouteRef-Bk50-K9_.js";import"./index-CWZByKrh.js";import"./InfoCard-BEiRq27A.js";import"./CardContent-BfmK405P.js";import"./ErrorBoundary-Dqj2pINV.js";import"./ErrorPanel-Cbj0fdBm.js";import"./WarningPanel-BCt9Bv9g.js";import"./ExpandMore-B67diL7X.js";import"./AccordionDetails-CZxQwlea.js";import"./index-B9sM2jn7.js";import"./Collapse-uTAZOzA3.js";import"./MarkdownContent-C9IhCAop.js";import"./CodeSnippet-BTTGQVt6.js";import"./Box-fRbsHjDs.js";import"./styled-XhcyHdDa.js";import"./CopyTextButton-Xa9XWeEV.js";import"./useCopyToClipboard-C5jlCbNf.js";import"./useMountedState-Bx1mDZHi.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";import"./Portal-W2FhbA1a.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./ListItem-DVuo4x9u.js";import"./ListItemText-B-CF-Ijo.js";import"./LinkButton-BpIPCZdv.js";import"./Link-DyiL97g3.js";import"./lodash-Czox7iJy.js";import"./Button-DR_OBMXZ.js";import"./CardHeader-BM2nPM7u.js";import"./Divider-C4EwzhjR.js";import"./CardActions-CTRx52Db.js";import"./BottomLink-XuI9KdJO.js";import"./ArrowForward-B_DalRq-.js";import"./DialogTitle-BOLKbyFf.js";import"./Modal-119bZl-Y.js";import"./Backdrop-CN6b5uOg.js";import"./useObservable-C7I0Kmlp.js";import"./useIsomorphicLayoutEffect-rUIA2I1q.js";import"./useAsync-CWT4UngH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
