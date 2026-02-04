import{j as t,U as a,V as c,W as g,m as l}from"./iframe-mdeHk8Us.js";import{b as i,r as d}from"./plugin-BVcbV0Ox.js";import{S as s}from"./Grid-DC2Tywm3.js";import{w as u}from"./appWrappers-BH9LHHFZ.js";import{T as f}from"./TemplateBackstageLogo-BNLSq80G.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BR79PUs9.js";import"./componentData-DyMAqMyS.js";import"./useAnalytics-Cte0NGRl.js";import"./useApp-DWNk4MUY.js";import"./useRouteRef-BPPz61H3.js";import"./index-DhB3CqmG.js";import"./InfoCard-DYz9dhWP.js";import"./CardContent-D1IhYZuq.js";import"./ErrorBoundary-BLGxg7ja.js";import"./ErrorPanel-De8J-gDX.js";import"./WarningPanel-Cg3FNdiM.js";import"./ExpandMore-4uaBqvpS.js";import"./AccordionDetails-CY4b5vf9.js";import"./index-B9sM2jn7.js";import"./Collapse-B45VguHP.js";import"./MarkdownContent-DOJrLrbX.js";import"./CodeSnippet-DzFJqA_2.js";import"./Box-C_VvrdzU.js";import"./styled-BGP2DNJW.js";import"./CopyTextButton-BqpZzKnD.js";import"./useCopyToClipboard-DVW_Y7r9.js";import"./useMountedState-DqT-X8D-.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";import"./Portal-CGi5eRlN.js";import"./List-X7Jezm93.js";import"./ListContext-EwKgne2S.js";import"./ListItem-L1zDUeu9.js";import"./ListItemText-DCPofTJa.js";import"./LinkButton-CSGY2AO6.js";import"./Link-dvajx9JY.js";import"./lodash-Czox7iJy.js";import"./Button-DaFlKZgy.js";import"./CardHeader-ByJ2FETy.js";import"./Divider-GxHdmRdJ.js";import"./CardActions-C4694dyD.js";import"./BottomLink-BPrh7zn-.js";import"./ArrowForward-BEuLEQbk.js";import"./DialogTitle-CmcGNy32.js";import"./Modal-uDaBb03U.js";import"./Backdrop-B1KztC8w.js";import"./useObservable-BYYos0JC.js";import"./useIsomorphicLayoutEffect-Bz91LDOF.js";import"./useAsync-DlW7WdkC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
