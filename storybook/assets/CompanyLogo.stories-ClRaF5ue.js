import{j as t,T as a,c,C as g,m as l}from"./iframe-CuO26Rmv.js";import{b as i,r as d}from"./plugin-Bq6hyHXs.js";import{S as s}from"./Grid-BfYuvVEF.js";import{w as u}from"./appWrappers-CqMB6nNx.js";import{T as f}from"./TemplateBackstageLogo-BzOf2txG.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BYJQvkSS.js";import"./componentData-jPnjY360.js";import"./useAnalytics-CdEHywY9.js";import"./useApp-BYLVa0iu.js";import"./useRouteRef-DasU4rh5.js";import"./index-CA92LH--.js";import"./InfoCard-ChGG-MHI.js";import"./CardContent-r0f801Ql.js";import"./ErrorBoundary-CFcBk-1U.js";import"./ErrorPanel-CDwA38MB.js";import"./WarningPanel-DSWSSSeS.js";import"./ExpandMore-BXwwuksY.js";import"./AccordionDetails-C3hb9ppk.js";import"./index-DnL3XN75.js";import"./Collapse-BQbZuamb.js";import"./MarkdownContent-Dnni9t_T.js";import"./CodeSnippet-jcNnShuM.js";import"./Box-CU-U4ibu.js";import"./styled-C8K_EIFt.js";import"./CopyTextButton-BNZ4H3Xn.js";import"./useCopyToClipboard-BtizGtOb.js";import"./useMountedState-Cwi1zouP.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";import"./Portal-BcfglCa0.js";import"./List-BAIPzTEx.js";import"./ListContext-0ULPV768.js";import"./ListItem-D5_amKXt.js";import"./ListItemText-CSVSzb3y.js";import"./LinkButton-5IaBbqVW.js";import"./Button-DlZ0BBap.js";import"./Link-DPuqs8WZ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-v7Sk4_UR.js";import"./Divider-vqslFKyv.js";import"./CardActions-NkzIkcmB.js";import"./BottomLink-DZSMcwn-.js";import"./ArrowForward-BT_Xitdy.js";import"./DialogTitle-HF8aA2AY.js";import"./Modal-6Ajkd_zG.js";import"./Backdrop-BlG2t9Br.js";import"./useObservable-CW3YJiyR.js";import"./useIsomorphicLayoutEffect-B9jQ_lJC.js";import"./useAsync-CNdJisKf.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
