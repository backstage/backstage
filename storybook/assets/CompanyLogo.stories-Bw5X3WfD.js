import{j as t,T as a,c,C as g,m as l}from"./iframe-BooBp-Po.js";import{b as i,r as d}from"./plugin-CCaDKLYY.js";import{S as s}from"./Grid-DyVJyHQ5.js";import{w as u}from"./appWrappers-CTUrCtOx.js";import{T as f}from"./TemplateBackstageLogo-eJkn5_Cg.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B6z4Q4HB.js";import"./componentData-UC---0ba.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./useRouteRef-C16BXt-W.js";import"./index-uVUaDJuf.js";import"./InfoCard-DIPvFOR7.js";import"./CardContent-C0i9nHGG.js";import"./ErrorBoundary-D5Pk8kNF.js";import"./ErrorPanel-J8VMJBUn.js";import"./WarningPanel-Df9ZONi2.js";import"./ExpandMore-Bspz5IQW.js";import"./AccordionDetails-DxggSv3D.js";import"./index-B9sM2jn7.js";import"./Collapse-CmSq19t6.js";import"./MarkdownContent-BDjlG_JM.js";import"./CodeSnippet-L6pub6pc.js";import"./Box-obs2E8MU.js";import"./styled-DJvGKcz3.js";import"./CopyTextButton-CtUqznh5.js";import"./useCopyToClipboard-B64G66d9.js";import"./useMountedState-BZIVYzWq.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";import"./Portal-TbQYoDFY.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./ListItem-CUDBczQT.js";import"./ListItemText-Bjf3smxb.js";import"./LinkButton-DpHtnVgU.js";import"./Button-Cv3OLp_n.js";import"./Link-6ZJtYR0w.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DbBll6nT.js";import"./Divider-k2YJ45XN.js";import"./CardActions-CisRazDZ.js";import"./BottomLink-fNgaEPxJ.js";import"./ArrowForward-B0hk3RK2.js";import"./DialogTitle-CrfKXT0M.js";import"./Modal-cDnVm_jG.js";import"./Backdrop-B9Tcq6ce.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./useAsync-BkydaeDo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
