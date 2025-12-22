import{j as t,T as a,c,C as g,m as l}from"./iframe-DZkam7Bj.js";import{b as i,r as d}from"./plugin-D6dEO2vP.js";import{S as s}from"./Grid-DBMZs7np.js";import{w as u}from"./appWrappers-Bg6ecWLG.js";import{T as f}from"./TemplateBackstageLogo-DMjCPBwX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D0wcgIxz.js";import"./componentData-D2mgrz7C.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./useRouteRef-BbGjzdGG.js";import"./index-BYedHEZ0.js";import"./InfoCard-DESjlp5V.js";import"./CardContent-m46vxV1w.js";import"./ErrorBoundary-UF8MZD5v.js";import"./ErrorPanel-DvnF6D1Z.js";import"./WarningPanel-W5ZE-W22.js";import"./ExpandMore-B142-YHG.js";import"./AccordionDetails-4Wsid_gA.js";import"./index-B9sM2jn7.js";import"./Collapse-CyMpxX-e.js";import"./MarkdownContent-0F8rqmt_.js";import"./CodeSnippet-BFE5NLd5.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./CopyTextButton-Bji7cX2P.js";import"./useCopyToClipboard-DSpaqeDH.js";import"./useMountedState-ChfRzppL.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";import"./Portal-mqL5KVNN.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./ListItem-DNrM1AYn.js";import"./ListItemText-CiywuPc3.js";import"./LinkButton-DWub5hGG.js";import"./Button-C84XLh64.js";import"./Link-BoLwiIPW.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CDP-7wiu.js";import"./Divider-CrMgh5SC.js";import"./CardActions-DiMkl16p.js";import"./BottomLink-DmPOneGd.js";import"./ArrowForward-DJhLoZFc.js";import"./DialogTitle-BODx1QEM.js";import"./Modal-Dli2H9pG.js";import"./Backdrop-970MLPke.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./useAsync-BRCkrjty.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
