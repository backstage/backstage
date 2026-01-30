import{j as t,U as a,V as c,W as g,m as l}from"./iframe-q37i5wh7.js";import{b as i,r as d}from"./plugin-t88-RfOu.js";import{S as s}from"./Grid-C05v6eeb.js";import{w as u}from"./appWrappers-COl_vAr6.js";import{T as f}from"./TemplateBackstageLogo-BxoY5tAX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CB9fW_xb.js";import"./componentData-E9OYffVp.js";import"./useAnalytics-Qh0Z6cDc.js";import"./useApp-DRQlf20V.js";import"./useRouteRef-Dm0QmNOs.js";import"./index-4QSZcc7K.js";import"./InfoCard-Cd6HgPXU.js";import"./CardContent-CMtJW6TZ.js";import"./ErrorBoundary-DCLXQR6g.js";import"./ErrorPanel-F1yEZWbU.js";import"./WarningPanel-C_8iIf0P.js";import"./ExpandMore-Dh8PJJ4O.js";import"./AccordionDetails-SWAG835D.js";import"./index-B9sM2jn7.js";import"./Collapse-EBwNTQD_.js";import"./MarkdownContent-Cy41HZJg.js";import"./CodeSnippet-CLlJVEMw.js";import"./Box-COPOq1Uf.js";import"./styled-Cr1yRHHC.js";import"./CopyTextButton-D-U2fpdK.js";import"./useCopyToClipboard-DKocU9ZU.js";import"./useMountedState-rIY5swUn.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";import"./Portal-Cg2yUny5.js";import"./List-PIZxoj_p.js";import"./ListContext-CjbrLwST.js";import"./ListItem-CpM31wZi.js";import"./ListItemText-DrEGNqUi.js";import"./LinkButton-BWyYwHDi.js";import"./Link-VlZlHdCt.js";import"./lodash-Czox7iJy.js";import"./Button-DPiRNZXm.js";import"./CardHeader-DxnZ9i-M.js";import"./Divider-DMqMfewh.js";import"./CardActions-CCEsNnC3.js";import"./BottomLink-BO513QD8.js";import"./ArrowForward-Bjdstcjo.js";import"./DialogTitle-CtRkS27u.js";import"./Modal-TMOxKW-w.js";import"./Backdrop-CWK59iWf.js";import"./useObservable-e6xV4JA9.js";import"./useIsomorphicLayoutEffect-BOIrCsYn.js";import"./useAsync-5U-iBZk2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
