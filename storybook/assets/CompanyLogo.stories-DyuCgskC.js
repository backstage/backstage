import{j as t,T as a,c,C as g,m as l}from"./iframe-C6d4amxQ.js";import{b as i,r as d}from"./plugin-DFI2I8hq.js";import{S as s}from"./Grid-WtUylni-.js";import{w as u}from"./appWrappers-BuwXBYCY.js";import{T as f}from"./TemplateBackstageLogo-DgtYRmQI.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C7MtdO6s.js";import"./componentData-BhUIek-Q.js";import"./useAnalytics-CEJvE44e.js";import"./useApp-BUIf5wuk.js";import"./useRouteRef-D7G3Qpmz.js";import"./index-Bwu9Fyg1.js";import"./InfoCard-CgJKC6GU.js";import"./CardContent-Bw4RFqsT.js";import"./ErrorBoundary-C3nTIgGK.js";import"./ErrorPanel-C4TycXbx.js";import"./WarningPanel-C-jRLCTC.js";import"./ExpandMore--4wftT15.js";import"./AccordionDetails-BgOvrYOY.js";import"./index-B9sM2jn7.js";import"./Collapse-Di3lEKwf.js";import"./MarkdownContent-BYJW4Slr.js";import"./CodeSnippet-3cP_Pubp.js";import"./Box-yXRZ3Xp2.js";import"./styled-BGGy5Grm.js";import"./CopyTextButton-CE5xtLZ0.js";import"./useCopyToClipboard-CH_VlaT9.js";import"./useMountedState-C6W4VPdE.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";import"./Portal-B6ENv45o.js";import"./List-qMmGjvCV.js";import"./ListContext-Baa1QRS6.js";import"./ListItem-CUGV6Izn.js";import"./ListItemText-DmvyJhay.js";import"./LinkButton-BQkTZkOF.js";import"./Button-Cu6BkngO.js";import"./Link-xhhwyYCu.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-C9AdOzcV.js";import"./Divider-BlWYsQ2U.js";import"./CardActions-5fjFai41.js";import"./BottomLink-DxVrnvh5.js";import"./ArrowForward-CERyzcOO.js";import"./DialogTitle-C6vJC5fn.js";import"./Modal-D1YXIVhd.js";import"./Backdrop-DBUbh-8q.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./useAsync-C2weF2sY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
