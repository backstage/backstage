import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CXYsSFqX.js";import{b as i,r as d}from"./plugin-D4U0AyrD.js";import{S as s}from"./Grid-CBLufU_i.js";import{w as u}from"./appWrappers-DM9hoX1F.js";import{T as f}from"./TemplateBackstageLogo-D1Ltqhoe.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYVtm61E.js";import"./componentData-B-Xp-WjF.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./useRouteRef-D_K4aVES.js";import"./index-mbELQmCK.js";import"./InfoCard-BhEjsNW2.js";import"./CardContent-BfiKMwCo.js";import"./ErrorBoundary-BYKn89zI.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./index-B9sM2jn7.js";import"./Collapse-BITvwjhQ.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./CopyTextButton-DFxCHX8I.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./useMountedState-2cXymIoR.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";import"./Portal-y4yvUJUe.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./ListItem-DLX99J84.js";import"./ListItemText-CvzrIeis.js";import"./LinkButton-DyFnZC8S.js";import"./Link-DWEj90Ez.js";import"./lodash-Czox7iJy.js";import"./Button-D0m-IwQo.js";import"./CardHeader-kRzKqXby.js";import"./Divider-DuenxdSn.js";import"./CardActions-DornRNWZ.js";import"./BottomLink-D1PtYDTo.js";import"./ArrowForward-Ak_-qeRR.js";import"./DialogTitle-CexE-OMt.js";import"./Modal-D6jcPeuR.js";import"./Backdrop-DpZkZfXy.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./useAsync-CNZKjAjJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
