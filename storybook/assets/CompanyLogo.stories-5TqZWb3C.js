import{j as t,T as a,c,C as g,m as l}from"./iframe-DXt6I_1q.js";import{b as i,r as d}from"./plugin-v6adl62a.js";import{S as s}from"./Grid-S6xSP1g4.js";import{w as u}from"./appWrappers-BbpqoopC.js";import{T as f}from"./TemplateBackstageLogo-prreIN44.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DguzI5U9.js";import"./componentData-ErQLe4OM.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./useRouteRef-CAgnkOiS.js";import"./index-kCs7zF-O.js";import"./InfoCard-CZWzg546.js";import"./CardContent-BwUEUqdM.js";import"./ErrorBoundary-Dn7kNKcq.js";import"./ErrorPanel-B33pLPVR.js";import"./WarningPanel-DQn25WOa.js";import"./ExpandMore-CSLlRCsy.js";import"./AccordionDetails-BnUWlxaJ.js";import"./index-DnL3XN75.js";import"./Collapse-DtNym6qB.js";import"./MarkdownContent-BXxoLhhS.js";import"./CodeSnippet-CItDkStU.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./CopyTextButton-BSjmWnC0.js";import"./useCopyToClipboard-BoyifASt.js";import"./useMountedState-BEJ2TW9Z.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";import"./Portal-DOTL7Yad.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./ListItem-CNHhXRSS.js";import"./ListItemText-CaGb_JPi.js";import"./LinkButton-rg2HdNk0.js";import"./Button-Bqv3NR6y.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Cc8WUsGZ.js";import"./Divider-rqAQKIY3.js";import"./CardActions-DQw2Z0X8.js";import"./BottomLink--V4SW3M9.js";import"./ArrowForward-CdPzQ0qE.js";import"./DialogTitle-DEXlHuyv.js";import"./Modal-O3HFvYR5.js";import"./Backdrop-PRNJOzON.js";import"./useObservable-DTc_vT-Q.js";import"./useIsomorphicLayoutEffect-l4gsGf2N.js";import"./useAsync-uNXDDhwP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
