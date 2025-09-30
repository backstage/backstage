import{j as t,T as a,c,C as g,m as l}from"./iframe-Bqhsa6Sh.js";import{b as i,r as d}from"./plugin-BBZXZmo4.js";import{S as s}from"./Grid-B6o2V4N5.js";import{w as u}from"./appWrappers-DpSGCgYr.js";import{T as f}from"./TemplateBackstageLogo-CSn29H2p.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-ChbcFySR.js";import"./componentData-BjQGtouP.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./useRouteRef-D2qGziGj.js";import"./index-C3od-xDV.js";import"./InfoCard-DqQrAMvM.js";import"./CardContent-eJLTlWrs.js";import"./ErrorBoundary-qLv6qWws.js";import"./ErrorPanel-DjMQdfdJ.js";import"./WarningPanel-ChwZGoqa.js";import"./ExpandMore-DtBTikql.js";import"./AccordionDetails-TLAxJNrY.js";import"./index-DnL3XN75.js";import"./Collapse-BmcxTB9C.js";import"./MarkdownContent-NPwWt_6a.js";import"./CodeSnippet-668TY6_y.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./CopyTextButton-BbR5f8cw.js";import"./useCopyToClipboard-Cacc49O7.js";import"./useMountedState-By8QTQnS.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";import"./Portal-C0qyniir.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./ListItem-BUcGiLuR.js";import"./ListItemText-CHn-6MvY.js";import"./LinkButton-xQ2OFSZK.js";import"./Button-BIWqIjhL.js";import"./Link-BYO-u9Rv.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-YTE5ohdi.js";import"./Divider-dXncAHZ6.js";import"./CardActions-CaoKmzIe.js";import"./BottomLink-Cq7vEnTL.js";import"./ArrowForward-o-fAnTPb.js";import"./DialogTitle-CWvQ0e48.js";import"./Modal-Bj_JGdVD.js";import"./Backdrop-jgSEnQhj.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./useAsync-CZ1-XOrU.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
