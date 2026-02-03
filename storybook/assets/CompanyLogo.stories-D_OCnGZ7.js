import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BMBKvx7J.js";import{b as i,r as d}from"./plugin-Bu2GiY8l.js";import{S as s}from"./Grid-BeDT5Yac.js";import{w as u}from"./appWrappers-BOJr_U7C.js";import{T as f}from"./TemplateBackstageLogo-DXlPr6Dp.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CijlMu_-.js";import"./componentData-DlTOR1Tf.js";import"./useAnalytics-6fQpVHvB.js";import"./useApp-CHxPlzN3.js";import"./useRouteRef-DhANQE8F.js";import"./index-f5vhF8Nw.js";import"./InfoCard-DE1zhvkY.js";import"./CardContent-BAt-txin.js";import"./ErrorBoundary-BQATzt5e.js";import"./ErrorPanel-D5Anj456.js";import"./WarningPanel-BEJQshL2.js";import"./ExpandMore-sNERVSEz.js";import"./AccordionDetails-jHFZItW8.js";import"./index-B9sM2jn7.js";import"./Collapse-BfJEIrfz.js";import"./MarkdownContent-DooLYWBv.js";import"./CodeSnippet-WffvFiX0.js";import"./Box-DyedS4TQ.js";import"./styled-COJRzbtL.js";import"./CopyTextButton-BXHrVG_E.js";import"./useCopyToClipboard-DCvnibP8.js";import"./useMountedState-BBcU3kFA.js";import"./Tooltip-DXXVKXwk.js";import"./Popper-BvJ_4JLG.js";import"./Portal-B2w_zRgr.js";import"./List-BQBKpXrc.js";import"./ListContext-dtOkQmZD.js";import"./ListItem-CBHuw_mT.js";import"./ListItemText-DxMoHBvJ.js";import"./LinkButton-D0OIQBP6.js";import"./Link-CAECYSd6.js";import"./lodash-Czox7iJy.js";import"./Button-CgZNjnDR.js";import"./CardHeader-D5ilYYS_.js";import"./Divider-ChrZ6SL1.js";import"./CardActions-3uJylBwn.js";import"./BottomLink-Dme4aBKb.js";import"./ArrowForward-C41XCtXB.js";import"./DialogTitle-DsbJKJA1.js";import"./Modal-CTUzy118.js";import"./Backdrop-B0L6nIyi.js";import"./useObservable-B1dXj24X.js";import"./useIsomorphicLayoutEffect-CtcAey4z.js";import"./useAsync-Hxi-KY7E.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
