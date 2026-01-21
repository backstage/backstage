import{j as t,T as a,c,C as g,m as l}from"./iframe-DfW0k9e4.js";import{b as i,r as d}from"./plugin-C2W4X8kV.js";import{S as s}from"./Grid-DOkM8E58.js";import{w as u}from"./appWrappers-Bey6bAOs.js";import{T as f}from"./TemplateBackstageLogo-BPFMgHvQ.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CujPLxPN.js";import"./componentData-AJopfss2.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./useRouteRef-CckqiBtY.js";import"./index-Gw3tDiAb.js";import"./InfoCard-AOVHQz_Y.js";import"./CardContent-C_v1HCxv.js";import"./ErrorBoundary-QuxMpnIx.js";import"./ErrorPanel-BMIN-fu2.js";import"./WarningPanel-BP-y6z0y.js";import"./ExpandMore-DgZ6UNBD.js";import"./AccordionDetails-B314eioH.js";import"./index-B9sM2jn7.js";import"./Collapse-kvPWdbht.js";import"./MarkdownContent-DX3OAbaQ.js";import"./CodeSnippet--VZdTbP8.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./CopyTextButton-BDBeSRds.js";import"./useCopyToClipboard-DOwrP97-.js";import"./useMountedState-qW-VDUVJ.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";import"./Portal-D7dEWwg8.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./ListItemText-IHJkJ5se.js";import"./LinkButton-BvSq_KJp.js";import"./Button-Fr0OfS-w.js";import"./Link-BloAuSmB.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BEXtfers.js";import"./Divider-CYGCiMiq.js";import"./CardActions-D-jrTd0z.js";import"./BottomLink-DRktrqa9.js";import"./ArrowForward-Cz23y3ha.js";import"./DialogTitle-CE2AHhUw.js";import"./Modal-B6gsZuYb.js";import"./Backdrop-BGOjf9vo.js";import"./useObservable-DVRVcpuV.js";import"./useIsomorphicLayoutEffect--dLzM9RT.js";import"./useAsync-CE87cvV8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
