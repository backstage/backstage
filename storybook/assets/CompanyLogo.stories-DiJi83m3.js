import{j as t,T as a,c,C as g,m as l}from"./iframe-CIM5duhm.js";import{b as i,r as d}from"./plugin-D9ar44j_.js";import{S as s}from"./Grid-Duc3jmgA.js";import{w as u}from"./appWrappers-C9XZWfKp.js";import{T as f}from"./TemplateBackstageLogo-D19pBo5l.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BahgJ1_U.js";import"./componentData-CysmgvuR.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./useRouteRef-BRIN7ftV.js";import"./index-eXSQF74E.js";import"./InfoCard-DYfoP3uw.js";import"./CardContent-Y_6Qe422.js";import"./ErrorBoundary-DW2AFmmD.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./ExpandMore-D2DOioK9.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./CopyTextButton-DEGdjETq.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./useMountedState-BMP6C5TD.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./Portal-6z5sMs7a.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./ListItem-C8QkAD_t.js";import"./ListItemText-BZPfuyb-.js";import"./LinkButton-c10FrtBS.js";import"./Button-qnzTC3D6.js";import"./Link-DCWBCw0R.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-AaChVV2H.js";import"./Divider-DA-kCS2y.js";import"./CardActions-LQToxJMs.js";import"./BottomLink-B0RwdjBb.js";import"./ArrowForward-Di3FBZA_.js";import"./DialogTitle-C7x4V4Yo.js";import"./Modal-CTawIxqI.js";import"./Backdrop-ktCLmDIR.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./useAsync-BVaj5mJ5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
