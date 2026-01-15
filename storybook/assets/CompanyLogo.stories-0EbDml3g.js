import{j as t,T as a,c,C as g,m as l}from"./iframe-C9MahRWh.js";import{b as i,r as d}from"./plugin-s8_OUas1.js";import{S as s}from"./Grid-Bq14PCTk.js";import{w as u}from"./appWrappers-CVRFJ8fS.js";import{T as f}from"./TemplateBackstageLogo-jnC9Qs1Q.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-COyD8Ape.js";import"./componentData-BjbrQk5D.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./useRouteRef-C79sp_qC.js";import"./index-Y3I5MZ_O.js";import"./InfoCard-C-Ku1r86.js";import"./CardContent-oIyv0kn_.js";import"./ErrorBoundary-DViLc_vS.js";import"./ErrorPanel-Cd_NhFA3.js";import"./WarningPanel-NX0KfHXh.js";import"./ExpandMore-C29ppj5F.js";import"./AccordionDetails-DeCV1Glt.js";import"./index-B9sM2jn7.js";import"./Collapse-COZrbk8h.js";import"./MarkdownContent-D9IOtBE8.js";import"./CodeSnippet-n_l-Y6Rc.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./CopyTextButton-6HBTp066.js";import"./useCopyToClipboard-CMkmug0-.js";import"./useMountedState-Dn_kttD3.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";import"./Portal-CaSAJtdX.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./ListItem-CEqAAvo8.js";import"./ListItemText-ULNmgNfA.js";import"./LinkButton-LGqlLhF5.js";import"./Button-Dzp_nJek.js";import"./Link-hmIS8MxR.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DlTILyHC.js";import"./Divider-BPY2Btf9.js";import"./CardActions-DJNyFBXf.js";import"./BottomLink-B7oZiutG.js";import"./ArrowForward-DNeec2hd.js";import"./DialogTitle-XE_ReIcx.js";import"./Modal-C6HnS9UY.js";import"./Backdrop-B07gdzN9.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./useAsync-BWwk_eba.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
