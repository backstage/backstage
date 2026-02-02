import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DG9KPDCv.js";import{b as i,r as d}from"./plugin-BZMPV-Oi.js";import{S as s}from"./Grid-BalTlFvh.js";import{w as u}from"./appWrappers-kZwlpPuG.js";import{T as f}from"./TemplateBackstageLogo-Cu85yhjy.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CiKdo3lK.js";import"./componentData-VtzvnnGf.js";import"./useAnalytics-DskDDOhn.js";import"./useApp-ijvxHEa-.js";import"./useRouteRef-CjX1VRTP.js";import"./index-Bi0fcTw3.js";import"./InfoCard-DO5i_j0E.js";import"./CardContent-BGfCwbYU.js";import"./ErrorBoundary-D71e96bV.js";import"./ErrorPanel-CIVa9hyi.js";import"./WarningPanel-Ttu6_E0y.js";import"./ExpandMore-CqQxAXKH.js";import"./AccordionDetails-BMa1mXpE.js";import"./index-B9sM2jn7.js";import"./Collapse-B-7etz-P.js";import"./MarkdownContent-CFcdNsXY.js";import"./CodeSnippet-Bw31BDNG.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./CopyTextButton-CBgD5fD0.js";import"./useCopyToClipboard-_Xorwdaf.js";import"./useMountedState-B6hIrLCn.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";import"./Portal-Du_aJAA6.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./ListItem-CdFlW9lK.js";import"./ListItemText-W0WQZlCP.js";import"./LinkButton-C2E1-Jxu.js";import"./Link-BeOk29Gb.js";import"./lodash-Czox7iJy.js";import"./Button-B0fitv1X.js";import"./CardHeader-DY4wzGjS.js";import"./Divider-e6kSnJJ8.js";import"./CardActions-BmSxOddO.js";import"./BottomLink-7FBGOaZa.js";import"./ArrowForward-CggHymR0.js";import"./DialogTitle-DOFx0Hy9.js";import"./Modal-BgaFEzC9.js";import"./Backdrop-BPZGx_ZF.js";import"./useObservable-Bi2yOTki.js";import"./useIsomorphicLayoutEffect-C3SuLUwq.js";import"./useAsync-BV2n2o7b.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
