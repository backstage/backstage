import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DbI6eD9d.js";import{b as i,r as d}from"./plugin-Cq85gQWd.js";import{S as s}from"./Grid-Bk30WVxK.js";import{w as u}from"./appWrappers-ysziI5ZA.js";import{T as f}from"./TemplateBackstageLogo-DAQHOjiw.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bb9hU_OU.js";import"./componentData-BY8qZ-sE.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./useRouteRef-DM8Co2Wr.js";import"./index-BpirQtKL.js";import"./InfoCard-C7uWqAKI.js";import"./CardContent-CaMsCQ3C.js";import"./ErrorBoundary-Pnzm6LGL.js";import"./ErrorPanel-DlUDd-32.js";import"./WarningPanel-M9-9T0mj.js";import"./ExpandMore-CGV1QMso.js";import"./AccordionDetails-BibEu-2M.js";import"./index-B9sM2jn7.js";import"./Collapse-DuLdQbrv.js";import"./MarkdownContent-BnX0THa8.js";import"./CodeSnippet-Cbn7wM4l.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./CopyTextButton-B5-s-8U_.js";import"./useCopyToClipboard-DYI1pKNQ.js";import"./useMountedState-x9skCR0V.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";import"./Portal-1epzlOBv.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./ListItemText-Cbx6sNjJ.js";import"./LinkButton-T-0yH8W0.js";import"./Link-BjQEuYrU.js";import"./lodash-Czox7iJy.js";import"./Button-BcRwA9XB.js";import"./CardHeader-DaQVS7Av.js";import"./Divider-CO6unGqT.js";import"./CardActions-B6MuYnHZ.js";import"./BottomLink-hMDyPyJY.js";import"./ArrowForward-0RbzQf1a.js";import"./DialogTitle-Bnldogbn.js";import"./Modal-DSfyr1-Y.js";import"./Backdrop-lRnFqTe6.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./useAsync-CgxXauOf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
