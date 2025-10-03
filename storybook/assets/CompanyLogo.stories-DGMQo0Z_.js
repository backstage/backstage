import{j as t,T as a,c,C as g,m as l}from"./iframe-QBX5Mcuo.js";import{b as i,r as d}from"./plugin-DLAShKum.js";import{S as s}from"./Grid-Q_BfCJNG.js";import{w as u}from"./appWrappers-357IU-cP.js";import{T as f}from"./TemplateBackstageLogo-6pKoH4Fz.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BpVAfwk3.js";import"./componentData-DHgvWv9V.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useApp-B1pSEwwD.js";import"./useRouteRef-Bc19hZiH.js";import"./index-CDF8GVFg.js";import"./InfoCard-DyGnoqeb.js";import"./CardContent-BGq9ULfl.js";import"./ErrorBoundary-DDmUM-RT.js";import"./ErrorPanel-Bnda3tGm.js";import"./WarningPanel-Ct6Y8Ijr.js";import"./ExpandMore-j96Z6uWc.js";import"./AccordionDetails-D8gh-z9a.js";import"./index-DnL3XN75.js";import"./Collapse-vSwdBrKa.js";import"./MarkdownContent-CGXvyksG.js";import"./CodeSnippet-Kn9vBnai.js";import"./Box-DE6c26DR.js";import"./styled-BjXftXcZ.js";import"./CopyTextButton-CQwOrqNE.js";import"./useCopyToClipboard-B79QevPK.js";import"./useMountedState-ByMBzLYV.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";import"./Portal-D97HJh_z.js";import"./List-CwkTxoFK.js";import"./ListContext-BfMtnPb8.js";import"./ListItem-CcSyfWmu.js";import"./ListItemText-BayZFfOR.js";import"./LinkButton-CSuChLvM.js";import"./Button-CVwDhsqF.js";import"./Link-C2fIupIe.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-kma2G_Yg.js";import"./Divider-DLQMODSR.js";import"./CardActions-BO1Jtm9a.js";import"./BottomLink-BnuP6Yck.js";import"./ArrowForward-C05mkkQp.js";import"./DialogTitle-BSYcyeQj.js";import"./Modal-B7uRaYS1.js";import"./Backdrop-DUF8g36-.js";import"./useObservable-BTlRHWB4.js";import"./useIsomorphicLayoutEffect-BYNl4sdH.js";import"./useAsync-DruiAlTJ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
