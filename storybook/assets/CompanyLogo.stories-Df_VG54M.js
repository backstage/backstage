import{j as t,T as a,c,C as g,m as l}from"./iframe-DpqnIERb.js";import{b as i,r as d}from"./plugin-Cx3M3zXy.js";import{S as s}from"./Grid-ByES49Fm.js";import{w as u}from"./appWrappers-DtX5QIpn.js";import{T as f}from"./TemplateBackstageLogo-BxY4hn1g.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BwzRXZkr.js";import"./componentData-Bjp7AxYA.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./useRouteRef-Do6k1rAi.js";import"./index-DoyRYStT.js";import"./InfoCard-DIeyI-8u.js";import"./CardContent-B6Jpg0qe.js";import"./ErrorBoundary-Dt-Pq3d7.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./ExpandMore-BgvB3-yb.js";import"./AccordionDetails-Bu4VHsDj.js";import"./index-B9sM2jn7.js";import"./Collapse-BXZ4KKDG.js";import"./MarkdownContent-C_B0rjEe.js";import"./CodeSnippet-BZN7CHRt.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./useMountedState-5johZ_Rp.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./Portal-BmmQaE8x.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./ListItemText-DoVLQ6VK.js";import"./LinkButton-ImbjNSpo.js";import"./Button-CVkCSpbG.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BeO5U3X8.js";import"./Divider-BjLL1Xub.js";import"./CardActions-B9E1ejZA.js";import"./BottomLink-InnL8-4N.js";import"./ArrowForward-BUxo812p.js";import"./DialogTitle--5D8qIle.js";import"./Modal-DsN87qYK.js";import"./Backdrop-BRjIVZ8-.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./useAsync-DJIduLQY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
